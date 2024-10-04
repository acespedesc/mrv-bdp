import { HttpClient } from "@angular/common/http";
import { EnvironmentInjector, inject, Injectable, signal } from "@angular/core";
import { environment } from "@envs/environment";
import { Region } from "app/models/region.interface";
import { Observable } from "rxjs";


@Injectable({providedIn : 'root'})
export class RegionService{
    
    private readonly _http = inject(HttpClient);
    private readonly _endPoint = environment.apiUrl;
    private readonly _injector = inject(EnvironmentInjector);

    public getRegion(): Observable <any> {

        return this._http.get<any[]>(`${this._endPoint}/region`)
         
     }

     public crearRegion(region : Region): Observable<any>{
        
        return this._http.post<any>(`${this._endPoint}/region`, region)
    }

    public actualizaRegion(id : number, region:Region ): Observable<any> {
        console.log(id)
         return this._http.put<any>(`${this._endPoint}/region/`+id, region)

    }
    public eliminaRegion(id: number): Observable<any>{
        return this._http.delete<any>(`${this._endPoint}/region/`+id)
    }
}