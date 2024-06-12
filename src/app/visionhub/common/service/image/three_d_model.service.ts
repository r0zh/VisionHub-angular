import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "../../../auth/services/auth.service";
import { map, retry, catchError, Observable, tap, throwError } from "rxjs";
import { environment } from "../../../../../environments/environment";
import { ThreeDModel } from "../../model/three_d_model";

@Injectable({
  providedIn: "root",
})
export class ThreeDModelService {
  constructor(private authService: AuthService, private httpClient: HttpClient) {}

  getPublicModels() {
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.authService.getToken(),
      }),
    };

    return this.httpClient.get<ThreeDModel[]>(`${environment.apiUrl}/models/public`, options).pipe(
      map((dataCollection) => {
        let models: ThreeDModel[] = new Array<ThreeDModel>();
        dataCollection.forEach((data) => {
          models.push(new ThreeDModel(data));
        });

        return models;
      }),
      retry(1),
      catchError(this.handleError)
    );
  }

  uploadThreeDModel(formData: FormData): Observable<any> {
    let threeDModel = new ThreeDModel({
      name: "",
      description: "",
      prompt: "",
      path: "",
      created_at: "",
      updated_at: "",
    });

    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.authService.getToken(),
      }),
    };

    return this.httpClient.post(`${environment.apiUrl}/models/upload`, formData, options).pipe(
      tap((data) => console.log(data)),
      retry(1),
      catchError(this.handleError)
    );
  }

  getUserThreeDModels(): Observable<ThreeDModel[]> {
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.authService.getToken(),
      }),
    };

    return this.httpClient.get<ThreeDModel[]>(`${environment.apiUrl}/models/user`, options).pipe(
      map((dataCollection) => {
        let models: ThreeDModel[] = new Array<ThreeDModel>();
        dataCollection.forEach((data) => {
          models.push(new ThreeDModel(data));
        });

        return models;
      }),
      retry(1),
      catchError(this.handleError)
    );
  }

  getThreeDModel(modelId: number) {
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.authService.getToken(),
      }),
    };

    return this.httpClient.get(`${environment.apiUrl}/model/${modelId}/get`, { ...options, responseType: "blob" }).pipe(
      tap((data) => (data)),
      retry(1),
      catchError(this.handleError)
    );
  }

  getThreeDModelThumbnail(modelId: number) {
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.authService.getToken(),
      }),
    };

    return this.httpClient.get(`${environment.apiUrl}/model/${modelId}/thumbnail`, { ...options, responseType: "blob" }).pipe(
      tap((data) => console.log(data)),
      retry(1),
      catchError(this.handleError)
    );
  }

  // Error handling
  private handleError(error: any) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
