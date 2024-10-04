import { HttpClient } from "@angular/common/http";
import { EnvironmentInjector, inject, Injectable } from "@angular/core";
import { environment } from "@envs/environment";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class DocAuxCalService {
    private readonly _http = inject(HttpClient);
    private readonly _endPoint = environment.apiUrl;
    private readonly _injector = inject(EnvironmentInjector);

    public crearDocumentoAuxCal(nombre: string, contenido: Blob, eciCirId: number): Observable<any> {
        //console.log(arch)

        const formData = new FormData();
        formData.append('nombre', nombre)
        formData.append('contenido', contenido); // Asegúrate de que este es el nombre correcto en tu backend
        formData.append('ecoCircularId', eciCirId.toString());
        return this._http.post<any>(`${this._endPoint}/doc`, formData)
    }


    public getDocumentoAuxCal(ecoCircularId : number |  null): Observable<any> {

        return this._http.get<any[]>(`${this._endPoint}/doc/`+ecoCircularId)
    }
}