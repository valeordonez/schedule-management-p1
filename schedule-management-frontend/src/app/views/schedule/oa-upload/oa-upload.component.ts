import { Component, OnInit } from '@angular/core';
import { OfertaAcademicaService } from 'src/app/services/oferta-academica/oferta-academica.service'
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { ResponseFile } from 'src/app/models/response-file.model';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-oa-upload',
  templateUrl: './oa-upload.component.html',
  styleUrls: ['./oa-upload.component.scss'],

})
export class OaUploadComponent implements OnInit {
  imgRta = '';
  colaPendientes: string[] = ['OA2022.2-Licenciatura en ingles', 'OA2022.2-Historia', 'OA2022.2-Humanidades'];
  public files1: File[] = [];
  responseFile: ResponseFile = {
    statusFile: '',
    contRows: 0,
    contErrorRows: 0,
    contSuccessRows: 0,
    contSaveRows: 0,
    logsType: [],
    logsEmptyFields: [],
    logsGeneric: [],
    logsSuccess: [],
  };
  programCode: string = '';
  constructor(
    private oaService: OfertaAcademicaService,
    private spinnerService: SpinnerService,
  ) { }

  ngOnInit(): void {
  }
  public dropped(files: NgxFileDropEntry[]) {
    //this.files = files;
    console.log(files)
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;

        fileEntry.file((file: File) => {
          const nameFile = file.name
          let dateAct = new Date()
          if (file?.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            || file?.type === 'application/vnd.ms-excel') {
            console.log(droppedFile.relativePath, file);
            this.files1.push(file)

            this.oaService.uploadFile(file)
              .subscribe(data => {
                let response = Object.values(data);
                this.responseFile = {
                  statusFile: response[0],
                  contRows: response[1],
                  contErrorRows: response[2],
                  contSuccessRows: response[3],
                  contSaveRows: response[4],
                  logsType: response[5],
                  logsEmptyFields: response[6],
                  logsGeneric: response[7],
                  logsSuccess: response[8],
                };
                if (this.responseFile.statusFile === 'ERROR') {
                  Swal.fire({
                    title: 'Hay errores en el archivo',
                    html: `
                <div style="text-align:center">
                <p>${this.responseFile.logsEmptyFields.length === 0 ? '' :
                        '<h5>Campos vacíos: </h5>' +
                        this.responseFile.logsEmptyFields.join('<br>').toLowerCase()
                      }</p>
                  <p>${this.responseFile.logsType.length === 0 ? '' :
                        '<h5>Campos vacíos: </h5>' +
                        this.responseFile.logsType.join('<br>').toLowerCase()
                      }</p>
                  <p>${this.responseFile.logsGeneric.length === 0 ? '' :
                        '<h5>Campos vacíos: </h5>' +
                        this.responseFile.logsGeneric.join('<br>').toLowerCase()
                      }</p>
                </div>
                `,
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#0A266F',
                  });
                } else {
                  Swal.fire({
                    title: 'Éxito!',
                    text: `Archivo subido correctamente`,
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#0A266F',
                  });
                }
                //borro el archivo cargado si se subio correctamente
                // element.value = '';
              })
          } else {
            Swal.fire({
              title: 'Error en el archivo ' + nameFile,
              html: `<p>El formato del archivo debe ser tipo Excel (.xlsx).<br>
              <b>Por favor verifica el formato y vuelve a intentarlo</p>`,
              icon: 'error',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#0A266F',
            });
            //borro el archivo cargado porque no es de tipo excel
            //element.value = '';
          }

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }
  onUpload(event: Event) {
    const element = event.target as HTMLInputElement;
    const file = element.files?.item(0);
    //verificamos que se haya seleccionado un archivo de tipo excel.
    if (file?.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      || file?.type === 'application/vnd.ms-excel') {

      if (file) {
        this.oaService.uploadFile(file)
          .subscribe(rta => {
            this.imgRta = rta.location;
            Swal.fire({
              title: 'Éxito!',
              text: `Archivo subido correctamente`,
              icon: 'success',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#0A266F',
            });
            //borro el archivo cargado si se subio correctamente
            element.value = '';
          },
            error => {
              Swal.fire({
                title: 'Error!',
                text: `Error subiendo el archivo`,
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#0A266F',
                }
              );
              //borro el archivo cargado así no se haya cargado
              element.value = '';
            });

      }
    } else {
      Swal.fire({
        title: 'Error en el archivo!',
        html: `<p>El formato del archivo debe ser tipo Excel (.xlsx).<br>
        <b>Por favor verifica el formato y vuelve a intentarlo</p>`,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#0A266F',
      });
      //borro el archivo cargado porque no es de tipo excel
      element.value = '';
    }

  }

    /**
     * Metodo que invica al servicio para descargar el template de carga de oferta academica
     */
  downloadTemplate() {
    this.programCode = 'PIS';
    console.log("llega al metodo");
    this.oaService.downloadTemplateService(this.programCode)
      .subscribe(data => {
        console.log("que llego; ", data);
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        let url = window.URL.createObjectURL(blob);
        window.open(url);
      });
  }

  public fileOver(event: Event) {
    console.log(event);
  }

  public fileLeave(event: Event) {
    console.log(event);
  }
}
