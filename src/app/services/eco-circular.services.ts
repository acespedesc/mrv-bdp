import { HttpClient } from "@angular/common/http";
import { EnvironmentInjector, inject, Injectable, signal } from "@angular/core";
import { environment } from "@envs/environment";
import { Circular } from "app/models/circular.interface";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class EcoCircularService {
    public ecoeficiencias = signal<Circular[]>([]);
    private readonly _http = inject(HttpClient);
    private readonly _endPoint = environment.apiUrl;
    private readonly _injector = inject(EnvironmentInjector);

    public crearEconomiaCircular(circular: FormData): Observable<any> {
        return this._http.post<any>(`${this._endPoint}/cir`, circular)
    }

    public getEconomiaCircular(): Observable<any> {
        return this._http.get<any[]>(`${this._endPoint}/cir`)
    }

    public getEcoCircularById(id :number | null): Observable<any> {

        console.log(id)
        return this._http.get<any[]>(`${this._endPoint}/cir/`+id)
    }

    public eliminaEcoCircular(id: number): Observable<any>{
        return this._http.delete<any>(`${this._endPoint}/cir/`+id)
    }

}