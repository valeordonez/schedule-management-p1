import { Component } from '@angular/core';
import { ReportRoom } from 'src/app/models/ReportRoom.model';
import { Faculty } from 'src/app/models/faculty.model';
import { Program } from 'src/app/models/program.model';
import { FacultyService } from 'src/app/services/Faculty/faculty.service';

@Component({
  selector: 'app-report-program',
  templateUrl: './report-program.component.html',
  styleUrls: ['../HojaEstilosReportesSCSS/reportes.component.scss']
})
export class ReportProgramComponent {

  title="Reporte Programa";
  
  isDisabled:boolean=false;//usado en html para los checkbox
  
  //encabezados de tablas  
  columnsTableProgramas:string[]=['Id Programa','Nombre del Programa','Seleccionar'];//Encabezados de Tabla Programas

  //banderas
  isFacSelected:boolean=false;   ///Variable bandera que indica si se ha seleccionado la facultad


  readonly valDefecto:string="defecto";///valor por defecto que tiene una opcion del Formulario antes de ser seleccionada
  
  //listas
  listafacultades:Faculty[]=[];   ///lista que contiene las facultades que se llenan en el desplegable html
  listasProgramas:Program[]=[];   ///lista que contiene los programaas de la facultad

  //DATOS REPORTE
  seleccionados: string[] = [];//contiene el id de los programas
  seleccionadoDic: Map<string, string> = new Map<string, string>();//contiene el id del programa como el nombre
  columnsReporte:string[]=['Id-sch','Dia','Hora Inicio','Hora Fin','Fecha Inici','Fecha Fin',
  'Ambiente','Materia','Programa', 'color'];//TODO:se debe cambiar las filas de reporte este es por programa
  esquemas: ReportRoom[][] = [];//TODO:se debe cambiar el tipo de reporte este es por programa

  constructor(    
    private  facservice:FacultyService    ///servicio encargado de traer las facultades
  ){}
  ngOnInit(){
    //llenamos las Facultades desde el servicio de facultad
    this.facservice.getAllFaculty().subscribe(
      (data: Faculty[]) => {
        this.listafacultades = data as Faculty[]; // Asignar los datos emitidos a la variable listafacultades
        //alert(this.listafacultades[0].facultyName);    
      },
      (error) => {
        console.log('Error obteniendo todas las facultades', error);
      }
    );
  }
  /**
   * este metodo es utilizado al seleccionar la facultad
   * cuando sea un valor valido (no el por defecto) cargara los programas
   * y permitira activar una vandera para en el html activar el bloque
   *  que contiene la tabla de progrmas y el boton de generar el reporte
   */
  onSelectedFacultad(event:Event){
    //comprueba que la facultad seleccionada no sea la agregada por defecto
    if (((event.target as HTMLInputElement).value)!=this.valDefecto){
      this.isFacSelected=true;//cambia el valor de esta variable para que se activen los otros campos
      this.cargarProgramas();
    }else{this.isFacSelected=false;//al ser la por defecto opcion deshabilita
    } 
  }
  cargarProgramas(){

  }
  GenerarReporte(){
    
  }
  /**
   * Este metodo sirve para controlar los items chequeados en la tabla y asi poder generar el reporte 
   * 
   * @param item es de tipo programa
   * @param event sirve para identificar si se ha chequeado o des chequeado
   */
  onSelectingPrograms(item: any, event: any): void {
    this.esquemas=[];
    if (event.target.checked) {
      // Agrega el id del programa a la lista de seleccionados que se encargara de generar el reporte
      this.seleccionados.push(item.programId);
      this.seleccionadoDic.set(item.programId, item.name);//asocia en diccionario el nombre del rograma al id
    } else {
      // Remueve el item.id de la lista de seleccionados
      const index = this.seleccionados.indexOf(item.id);
      if (index !== -1) {
        this.seleccionados.splice(index, 1);
      }
    }
  }
}
