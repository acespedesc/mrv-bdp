import { HttpClient } from "@angular/common/http";
import { EnvironmentInjector, inject, Injectable, signal } from "@angular/core";
import { environment } from "@envs/environment";
import { FacEmiTipoResiduo } from "app/models/fac-emi-tipo-residuo.interface";
import { Observable } from "rxjs";


@Injectable({providedIn : 'root'})
export class FacEmiTipoResiduoService{
  
    private readonly _http = inject(HttpClient);
    private readonly _endPoint = environment.apiUrl;
    private readonly _injector = inject(EnvironmentInjector);

    public getFacEmiTipoResiduo(resId: number | null): Observable <any> {

        return this._http.get<any[]>(`${this._endPoint}/fetr/`+resId)
         
     }

    

     public crearFacEmiTipoResiduo(feTipoResiduo : FacEmiTipoResiduo): Observable<any>{
        
        return this._http.post<any>(`${this._endPoint}/fetr`, feTipoResiduo)
    }

    public actualizaFacEmiTipoResiduo(id : number, feTipoResiduo:FacEmiTipoResiduo ): Observable<any> {
        
         return this._http.put<any>(`${this._endPoint}/fetr/`+id, feTipoResiduo)

    }
    public eliminaFacEmiTipoResiduo(id: number): Observable<any>{
        return this._http.delete<any>(`${this._endPoint}/fetr/`+id)
    }
}