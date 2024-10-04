import { HttpClient } from "@angular/common/http";
import { EnvironmentInjector, inject, Injectable } from "@angular/core";
import { environment } from "@envs/environment";
import { Observable } from "rxjs";
import { Subcategoria} from 'app/models/subcategoria.interface'


@Injectable({ providedIn: 'root' })
export class SubcategoriaService {
    private readonly _http = inject(HttpClient);
    private readonly _endPoint = environment.apiUrl;
    private readonly _injector = inject(EnvironmentInjector);

    public getSubcategoria(): Observable<any> {

        return this._http.get<any[]>(`${this._endPoint}/subcategoria`)
    }

    public crearSubcategoria(sub: Subcategoria): Observable<any> {
        console.log(sub)
        return this._http.post<any>(`${this._endPoint}/subcategoria`, sub)
    }

    public actualizaSubcategoria(id : number, sub:Subcategoria ): Observable<any> {
        console.log(id)
         return this._http.put<any>(`${this._endPoint}/subcategoria/`+id, sub)

    }

    public eliminaSubcategoria(id: number): Observable<any>{
        return this._http.delete<any>(`${this._endPoint}/subcategoria/`+id)
    }

    
}