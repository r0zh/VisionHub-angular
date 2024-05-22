import { Injectable } from "@angular/core";
import { environment } from "../../../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "../../../auth/services/auth.service";
import { Image } from "../../model/image";
import { Observable, catchError, map, retry, tap, throwError } from "rxjs";
import { consumerPollProducersForChange } from "@angular/core/primitives/signals";
import { response } from "express";

@Injectable({
  providedIn: "root",
})
export class ImageService {
  constructor(private authService: AuthService, private httpClient: HttpClient) {}

  getAllImages(): Observable<Image[]> {
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.authService.getToken(),
      }),
    };

    return this.httpClient.get<Image[]>(`${environment.apiUrl}/images`, options).pipe(
      map((dataCollection) => {
        let images: Image[] = new Array<Image>();
        dataCollection.forEach((data) => {
          images.push(new Image(data));
        });

        return images;
      }),
      retry(1),
      catchError(this.handleError)
    );
  }

  getImage(imageId: number) {
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.authService.getToken(),
      }),
    };

    return this.httpClient.get(`${environment.apiUrl}/images/${imageId}/get`, { ...options, responseType: "blob" }).pipe(
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
