import { AfterViewInit, ChangeDetectorRef, Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { Environment } from 'src/app/models/environment.model';
import { Schedule, ScheduleColor } from 'src/app/models/schedule.model';
import { ScheduleService } from 'src/app/services/schedule/schedule.service';
import { ScheduleRowComponent } from '../schedule-row/schedule-row.component';

@Component({
  selector: 'app-schedule-view',
  templateUrl: './schedule-view.component.html',
  styleUrls: ['./schedule-view.component.scss']
})
export class ScheduleViewComponent implements AfterViewInit {

  numeroDia?: number;
  contador: number = 0;
  headers:string[]=["hora","lunes","martes","miercoles","jueves","viernes","sabado"]
  weekDays=["lunes","martes","miercoles","jueves","viernes","sabado"]
  horariosAmbienteColor!:ScheduleColor[];
  
  
  horasDia=["07:00:00","08:00:00","09:00:00","10:00:00","11:00:00","12:00:00","13:00:00","14:00:00","15:00:00","16:00:00","17:00:00","18:00:00","19:00:00","20:00:00","21:00:00","22:00:00"]
  showHorario=false
  @Input('ambiente') ambiente!:Environment;
  @ViewChild('child') child!: ScheduleRowComponent;


  constructor(
    private scheduleService:ScheduleService,
    private cdr: ChangeDetectorRef
  ){
    this.initializeHorario();
  }
  ngAfterViewInit(): void {

    this.scheduleService.getTakenEnvironmentSchedule(this.ambiente.id).subscribe((response) =>{
      
      this.horariosAmbienteColor = response as ScheduleColor[]
      

    });
  }


  ngOnInit(){



  }
 
  ngOnChanges(changes: SimpleChanges): void {


  }
  getShowHorario(value:boolean){
    this.showHorario=value
  }

  timeInRange(inicial:string, final:string,franja:string){
    //lo va a pintar si
    //inicial es igual a la franja o ( si el final es mayor a la franja y el inicial es menor a la franja)

    if(inicial==franja || ( parseInt(final)>parseInt(franja) && parseInt(inicial)<parseInt(franja)) ){
      // console.log("retorna true para pintar ")
      return true
    }
   
    return false
  }


  horario: any = {};

 

  initializeHorario() {
    for (let i = 0; i < this.horasDia.length; i++) {
      this.horario[this.horasDia[i]] = {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: []
      };
    }
  }

 
  allowDrop(event: any) {
    event.preventDefault();
  }

  drop(event: any, day: number, hour: string) {
    event.preventDefault();
    const materia = event.dataTransfer.getData("text/plain");
  
    // Verificar si las dos franjas horarias consecutivas están vacías
    if (
      this.horario[hour][day].length >= 1 ||
      this.horario[this.getNextHour(hour)][day].length >= 1
    ) {
      // Si alguna de las dos franjas horarias ya tiene una materia, no se permite agregar más
      return;
    }
  
    // Obtener la siguiente hora en formato de cadena
    const nextHour = this.getNextHour(hour);
  
    // Obtener las franjas horarias desde hour hasta nextHour
    const hoursRange = this.getHoursRange(hour, nextHour);
  
    // Verificar si alguna de las franjas horarias ya tiene una materia
    if (hoursRange.some((h) => this.horario[h][day].length >= 1)) {
      // Si alguna franja horaria ya tiene una materia, no se permite agregar más
      return;
    }
  
    // Agregar la materia en todas las franjas horarias del rango
    hoursRange.forEach((h) => {
      this.horario[h][day].push(materia);
    });
  
    // Eliminar las dos franjas horarias correspondientes de la lista original
    const index = this.horasDia.indexOf(materia);
    if (index !== -1) {
      this.horasDia.splice(index, 2); // Eliminar dos elementos consecutivos
    }
  }
  
  getNextHour(hour: string): string {
    const [hourStr] = hour.split(":");
    const hourInt = parseInt(hourStr);
    const nextHourInt = hourInt + 1; // Avanzar una hora
    const nextHourStr = nextHourInt.toString().padStart(2, "0");
    return nextHourStr + ":00:00";
  }
  
  getHoursRange(startHour: string, endHour: string): string[] {
    const hoursRange: string[] = [];
    let currentHour = startHour;
  
    while (currentHour <= endHour) {
      hoursRange.push(currentHour);
      currentHour = this.getNextHour(currentHour);
    }
  
    return hoursRange;
  }
  
  
  getPreviousHour(hour: string): string {
    const [hourStr] = hour.split(":");
    const hourInt = parseInt(hourStr);
    const previousHourInt = hourInt - 1; // Retroceder una hora
    const previousHourStr = previousHourInt.toString().padStart(2, "0");
    return previousHourStr + ":00:00";
  }
  

  removeMateria(day: number, hour: string, index: number) {
    const previousHour = this.getPreviousHour(hour);
    const nextHour = this.getNextHour(hour);
    const removedMateria = this.horario[hour][day].splice(index, 1)[0]; // Eliminar el elemento de la franja horaria actual
  
    // Buscar el índice del elemento correspondiente en la franja horaria siguiente
    const nextHourIndex = this.horario[nextHour][day].indexOf(removedMateria);
  
    if (nextHourIndex !== -1) {
      // Si se encuentra el elemento en la franja horaria siguiente, eliminarlo
      this.horario[nextHour][day].splice(nextHourIndex, 1);
    }
  
    // Buscar el índice del elemento correspondiente en la franja horaria anterior
    const previousHourIndex = this.horario[previousHour][day].indexOf(removedMateria);
  
    if (previousHourIndex !== -1) {
      // Si se encuentra el elemento en la franja horaria anterior, eliminarlo
      this.horario[previousHour][day].splice(previousHourIndex, 1);
    }
  }
  confirmRemoveMateria(day: number, hour: string, index: number): void {
    if (window.confirm("¿Estás seguro de que deseas eliminar este curso?")) {
      this.removeMateria(day, hour, index);
    }
  }
  
  
  
  
  
  
  
  
  

  getMaterias(day: number, hour: string) {
    return this.horario[hour][day];
  }

  weekDayToInteger(weekDays: String[], day: string){
    for (let i = 0; i < weekDays.length; i++) {
      if (weekDays[i] === day) {
        return i;
      }
    }
    return -1;
  }


}
