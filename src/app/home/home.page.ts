import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonModal, IonItem, IonLabel, IonTextarea, IonButton,
  IonImg, IonButtons
} from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { Camera } from '@capacitor/camera';
import * as L from 'leaflet';
import { RegistroUbicacion, RegistroUbicacionService } from '../services/registro-ubicacion.service';
import { PUNTOS_MAPA, PuntoMapa } from './puntos';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonModal, IonItem, IonLabel, IonTextarea, IonButton,
    IonImg, IonButtons
  ],
})
export class HomePage implements AfterViewInit {
  @ViewChild(IonModal) modal!: IonModal;

  private map!: L.Map;
  private registroService = inject(RegistroUbicacionService);

  private iconoMarcador = L.icon({
    iconUrl: 'assets/icon/marker.png',
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40],
  });

  // Estado temporal mientras se llena el modal
  fotoTemporal: string | null = null;
  notaTemporal = '';
  private coordsTemporal: { lat: number; lng: number } | null = null;

  ngAfterViewInit(): void {
    this.initMapa();
  }

  async initMapa(): Promise<void> {
    const point = await Geolocation.getCurrentPosition();
    const { latitude, longitude } = point.coords;

    this.map = L.map('map').setView([latitude, longitude], 17);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
 
    L.marker([latitude, longitude], { icon: this.iconoMarcador })
      .addTo(this.map)
      .bindPopup('Estás aquí')
      .openPopup();

    this.agregarLugaresFijos();

    // Click en cualquier parte del mapa -> iniciar registro
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.iniciarRegistro(e.latlng.lat, e.latlng.lng);
    });

    await this.cargarRegistros();

    setTimeout(() => this.map.invalidateSize(), 100);
  }

  /** Agrega al mapa los 20 lugares definidos para la actividad. */
  private agregarLugaresFijos(): void {
    const marcadores = L.featureGroup();

    PUNTOS_MAPA.forEach((punto) => {
      const iconoLugar = L.divIcon({
        className: 'marcador-con-icono',
        html: `
          <div class="pin-azul" aria-hidden="true">
            <img class="pin-azul__icono" src="${punto.icono}" alt="" />
          </div>
        `,
        iconSize: [42, 48],
        iconAnchor: [21, 48],
        popupAnchor: [0, -46],
      });

      const marcador = L.marker(punto.coords, { icon: iconoLugar })
        .bindPopup(this.crearPopupLugar(punto), {
          maxWidth: 230,
          className: 'popup-lugar-fijo',
        });

      marcador.addTo(this.map);
      marcador.addTo(marcadores);
    });

    if (PUNTOS_MAPA.length > 0) {
      this.map.fitBounds(marcadores.getBounds(), {
        padding: [30, 30],
        maxZoom: 13,
      });
    }
  }

  /** Construye el contenido visible al tocar un marcador fijo. */
  private crearPopupLugar(punto: PuntoMapa): string {
    return `
      <article class="popup-lugar">
        <div class="popup-lugar__contenido">
          <h3>${this.escaparHtml(punto.nombre)}</h3>
          <p><strong>Latitud:</strong> ${punto.coords[0].toFixed(6)}</p>
          <p><strong>Longitud:</strong> ${punto.coords[1].toFixed(6)}</p>
        </div>
      </article>
    `;
  }

  /** Botón para registrar en la ubicación actual del usuario. */
  async registrarAqui(): Promise<void> {
    const point = await Geolocation.getCurrentPosition();
    await this.iniciarRegistro(point.coords.latitude, point.coords.longitude);
  }

  async iniciarRegistro(lat: number, lng: number): Promise<void> {
    try {
      const foto = await Camera.takePhoto({
        quality: 70,
        // Reduce el tamaño ya en el plugin (Android/iOS). En web esto se ignora,
        // pero la compresión por canvas de abajo cubre ese caso.
        targetWidth: 800,
        targetHeight: 800,
        correctOrientation: true,
      });

      // takePhoto devuelve un MediaResult: en web `thumbnail` trae la imagen
      // completa en base64; en nativo también viene el base64 en `thumbnail`.
      const base64 = foto.thumbnail ?? '';
      if (!base64) {
        return;
      }

      // Comprimimos/redimensionamos antes de guardar para no exceder la cuota
      // de almacenamiento (Preferences usa localStorage en web, ~5 MB).
      this.coordsTemporal = { lat, lng };
      this.fotoTemporal = await this.comprimirImagen(`data:image/jpeg;base64,${base64}`);
      this.notaTemporal = '';

      await this.modal.present();
    } catch (error) {
      console.log('Usuario canceló la foto', error);
    }
  }

  /**
   * Redimensiona la imagen a un ancho máximo y la re-codifica como JPEG con
   * calidad reducida. Devuelve un dataURL mucho más liviano que el original.
   */
  private comprimirImagen(dataUrl: string, anchoMax = 800, calidad = 0.6): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const escala = Math.min(1, anchoMax / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * escala);
        canvas.height = Math.round(img.height * escala);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo obtener el contexto 2D'));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', calidad));
      };
      img.onerror = () => reject(new Error('No se pudo cargar la imagen'));
      img.src = dataUrl;
    });
  }

  async guardarRegistro(): Promise<void> {
    if (!this.coordsTemporal || !this.fotoTemporal) {
      return;
    }

    try {
      const nuevo = await this.registroService.agregar({
        lat: this.coordsTemporal.lat,
        lng: this.coordsTemporal.lng,
        nota: this.notaTemporal,
        fotoBase64: this.fotoTemporal,
      });

      this.agregarMarcador(nuevo);
      await this.cerrarModal();
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'No se pudo guardar el registro.';
      window.alert(mensaje);
    }
  }

  async cerrarModal(): Promise<void> {
    await this.modal.dismiss();
    this.fotoTemporal = null;
    this.notaTemporal = '';
    this.coordsTemporal = null;
  }

  private async cargarRegistros(): Promise<void> {
    const registros = await this.registroService.obtenerTodos();
    registros.forEach((r) => this.agregarMarcador(r));
  }

  private agregarMarcador(registro: RegistroUbicacion): void {
    const popupContent = `
      <div style="text-align:center; max-width:180px;">
        <img src="${registro.fotoBase64}" style="width:150px; border-radius:8px;" />
        <p style="margin:4px 0; font-size:12px; color:#666;">${this.escaparHtml(registro.fecha)}</p>
        <p style="margin:0;">${this.escaparHtml(registro.nota || '(sin nota)')}</p>
      </div>
    `;

    L.marker([registro.lat, registro.lng], { icon: this.iconoMarcador })
      .addTo(this.map)
      .bindPopup(popupContent);
  }

  private escaparHtml(valor: string): string {
    return valor
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
}
