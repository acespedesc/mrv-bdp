import { HttpClient } from "@angular/common/http";
import { EnvironmentInjector, inject, Injectable, signal } from "@angular/core";
import { environment } from "@envs/environment";

import { MaquinariaReciclaje } from "app/models/maquinaria-reciclaje.interface";

import { Observable } from "rxjs";


@Injectable({providedIn : 'root'})
export class MaquinariaReciclajeService{
    public maquinariaReciclaje = signal<MaquinariaReciclaje[]>([]);
    private readonly _http = inject(HttpClient);
    private readonly _endPoint = environment.apiUrl;
    private readonly _injector = inject(EnvironmentInjector);

    public getMaquinariaReciclaje(residuoId: number | null): Observable <any> {

        return this._http.get<any[]>(`${this._endPoint}/maquinaria/`+residuoId)
         
     }

    
     public crearMaquinariaReciclaje(maquinaria : MaquinariaReciclaje): Observable<any>{
        
        return this._http.post<any>(`${this._endPoint}/maquinaria`, maquinaria)
    }

    public actualizaMaquinariaReciclaje(id : number, maquinaria:MaquinariaReciclaje ): Observable<any> {
        
         return this._http.put<any>(`${this._endPoint}/maquinaria/`+id, maquinaria)

    }
    public eliminaMaquinariaReciclaje(id: number): Observable<any>{
        return this._http.delete<any>(`${this._endPoint}/maquinaria/`+id)
    }
}