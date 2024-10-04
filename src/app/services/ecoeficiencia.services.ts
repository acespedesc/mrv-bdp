import { HttpClient } from "@angular/common/http";
import { EnvironmentInjector, inject, Injectable, signal } from "@angular/core";
import { environment } from "@envs/environment";
import { Ecoeficiencia } from "app/models/ecoeficiencia.interface";
import { Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class EcoeficienciaService {
    public ecoeficiencias = signal<Ecoeficiencia[]>([]);
    private readonly _http = inject(HttpClient);
    private readonly _endPoint = environment.apiUrl;
    private readonly _injector = inject(EnvironmentInjector);

    public crearEcoeficiencia(eco: FormData): Observable<any> {
        console.log(eco)
        return this._http.post<any>(`${this._endPoint}/eco`, eco)
    }


    public getEcoeficiencia(): Observable<any> {
        return this._http.get<any[]>(`${this._endPoint}/eco`)
    }

    public getEcoeficienciaById(id :number | null): Observable<any> {

        console.log(id)
        return this._http.get<any[]>(`${this._endPoint}/eco/`+id)
    }

    public eliminaEcoeficiencia(id: number): Observable<any>{
        return this._http.delete<any>(`${this._endPoint}/eco/`+id)
    }

}