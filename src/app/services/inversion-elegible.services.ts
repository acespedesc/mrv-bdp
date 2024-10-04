import { HttpClient } from "@angular/common/http";
import { EnvironmentInjector, inject, Injectable } from "@angular/core";
import { environment } from "@envs/environment";
import { InversionElegible } from "app/models/inversion-elegible.interface";
import { Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class InvElegibleService {
    private readonly _http = inject(HttpClient);
    private readonly _endPoint = environment.apiUrl;
    private readonly _injector = inject(EnvironmentInjector);

    public crearInversionElegible(invele: InversionElegible): Observable<any> {
        console.log(invele)
        const formData = new FormData();
        formData.append('nombre', invele.nombre)
        formData.append('categoria', invele.categoria)
        formData.append('indicador_efi_ener', invele.indicador_efi_ener); // Asegúrate de que este es el nombre correcto en tu backend
        formData.append('linea_base', invele.linea_base);
        formData.append('criterio_elegible', invele.criterio_elegible);
        formData.append('img_elegible', invele.img_elegible);
        formData.append('subcategoriaId',invele.subcategoriaId.toString());
        return this._http.post<any>(`${this._endPoint}/elegible`, formData)
    }

    public getInversionElegible(subId : number |  null): Observable<any> {

        return this._http.get<any[]>(`${this._endPoint}/elegible/`+subId)
    }

    public eliminaInversionElegible(id: number): Observable<any>{
        return this._http.delete<any>(`${this._endPoint}/elegible/`+id)
    }
    
}