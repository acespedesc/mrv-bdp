import { HttpClient } from "@angular/common/http";
import { EnvironmentInjector, inject, Injectable, signal } from "@angular/core";
import { environment } from "@envs/environment";
import { Ods } from "app/models/ods.interface";
import { Observable } from "rxjs";


@Injectable({providedIn : 'root'})
export class OdsService{
    public ods = signal<Ods[]>([]);
    private readonly _http = inject(HttpClient);
    private readonly _endPoint = environment.apiUrl;
    private readonly _injector = inject(EnvironmentInjector);

    public getOds(ecoId: number | null): Observable <any> {

        return this._http.get<any[]>(`${this._endPoint}/ods/`+ecoId)
         
     }

     public getCircularOds(ecoCircularId: number | null): Observable <any> {

        return this._http.get<any[]>(`${this._endPoint}/odscir/`+ecoCircularId)
         
     }

    

     public crearOds(ods : Ods): Observable<any>{
        
        return this._http.post<any>(`${this._endPoint}/ods`, ods)
    }

   
}
