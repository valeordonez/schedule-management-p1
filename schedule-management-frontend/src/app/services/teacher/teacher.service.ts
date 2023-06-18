import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  endPoint: String = environment.urlPerson
  departments: string[] = ['TODOS', 'SISTEMAS', 'TELECOMUNICACIONES'];

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };

  constructor(
    private http: HttpClient
  ) { }

  getAllTeachersPage(page: number, pageSize: number): Observable<any> {
    //TODO agregar autorizacion
    //{ headers: this.userServie.agregarAuthorizationHeader() }
    console.log('ver este: ', this.endPoint)
    return this.http.get<any>(this.endPoint + '/byPersonType' + `?page=${page - 1}&size=${pageSize}&sort=personCode&order=ASC`).pipe(
      catchError((e) => {
        // this.router.navigate(['/documentos']);

        console.log('Error obteniendo todos los profesores', e.error.mensaje, 'error');
        return throwError(e);

      })
    );
  }


  getDepartmentsName() {
    return this.departments;
  }

  getAllPersonByPersonTypePage(type: string, page: number, pageSize: number): Observable<any> {
    //TODO agregar autorizacion
    // localhost:8081/api/environment/byEnvironmentType?page=0&size=10&sort=id&order=ASC&environmentType=LABORATORIO
    //{ headers: this.userServie.agregarAuthorizationHeader() }
    console.log('ver este: ', this.endPoint)
    console.log('ver este: ', page)
    console.log('ver este: ', pageSize)

    return this.http.get<any>(
      this.endPoint + '/byPersonType' + `?page=${page - 1}&size=${pageSize}&sort=personCode&order=ASC&personType=${type}`)
      .pipe(
        catchError((e) => {
          // this.router.navigate(['/documentos']);

          console.log('Error obteniendo todos los profesores', e.error.mensaje, 'error');
          return throwError(e);

        })
      );
  }

  findAllByDepartmetName(name: string, type: string, page: number, pageSize: number): Observable<any> {
    //TODO agregar autorizacion
    return this.http.get<any>(
      this.endPoint + '/byDepartmetId' + `?page=${page - 1}&size=${pageSize}&sort=personCode&order=ASC&departmentName=${name}&personType=${type}`)
      .pipe(
        catchError((e) => {
          console.log('Error obteniendo todos los profesores por departamento', e.error.mensaje, 'error');
          return throwError(e);
        })
      );
  }
  uploadFile(file: Blob) {
    const dto = new FormData();
    dto.append('file', file);
    return this.http.post<File>(this.endPoint + '/uploadFile', dto, {
    });
  }
  downloadTemplateService() {
    console.log("llega al metodo al servicio ", this.endPoint);
    return this.http.get(this.endPoint + '/downloadTemplate', { responseType: 'blob' });
  }
}

