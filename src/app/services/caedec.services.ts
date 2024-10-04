import { HttpClient } from "@angular/common/http";
import { EnvironmentInjector, inject, Injectable, signal } from "@angular/core";
import { environment } from "@envs/environment";
import { Caedec } from "app/models/caedec.interface";
import { Observable } from "rxjs";


@Injectable({providedIn : 'root'})
export class CaedecService{
    public caedecs = signal<Caedec[]>([]);
    private readonly _http = inject(HttpClient);
    private readonly _endPoint = environment.apiUrl;
    private readonly _injector = inject(EnvironmentInjector);

    public getCaedecs(): Observable <any> {

        return this._http.get<any[]>(`${this._endPoint}/caedec`)
         
     }

     public crearCaedec(cae : Caedec): Observable<any>{
        console.log(cae)
        return this._http.post<any>(`${this._endPoint}/caedec`, cae)
    }

    public actualizaCaedec(id : number, cae:Caedec ): Observable<any> {
        console.log(id)
         return this._http.put<any>(`${this._endPoint}/caedec/`+id, cae)

    }
    public eliminaCaedec(id: number): Observable<any>{
        return this._http.delete<any>(`${this._endPoint}/caedec/`+id)
    }
}