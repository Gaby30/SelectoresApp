import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';
import { PaisesServiceService } from '../../services/paises-service.service';
import { PaisSmall } from '../../interfaces/paises.interfaces';
import { Pais } from '../../interfaces/pais.interfaces';


@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  regiones: string[] = [];
  paises: PaisSmall[] = [];
  //fronteras: string[] = [];
  fronteras: PaisSmall[] = [];

  //UI
  cargando: boolean = false;

  constructor(private fb: FormBuilder,
    private ps:PaisesServiceService) { }
  
  miFormulario: FormGroup = this.fb.group({
    region: ['', [Validators.required]],
    pais: ['', [Validators.required]],
    frontera: ['', [Validators.required]]
  });

  ngOnInit(): void {

    this.regiones = this.ps.regiones;

    //cuando cambie region
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap((_) => {
          this.miFormulario.get('pais').reset('');
          this.cargando = true;
        }),
        switchMap(region => this.ps.getPaisesByRegion(region))
      )
      .subscribe(paises => {
        this.paises = paises;
        this.cargando = false;
      });
    
    //cuando cambie Pais
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap(() => {
          this.miFormulario.get('frontera').reset('');
          this.cargando = true;
        }),
        switchMap(codigo => this.ps.getPaisesByCode( codigo )),
        switchMap( pais => this.ps.getPaisesByBorders( pais?.borders! ))
      )
      .subscribe(paises => {
        this.fronteras = paises;
        this.cargando = false;
      });
    

    /*cuando cambie region
    this.miFormulario.get('region')?.valueChanges
      .subscribe(region => {
        
        this.ps.getPaisesByRegion(region)
          .subscribe(countries => {
            this.paises = countries;
            console.log(this.paises);
          })
      }
    );*/
  }

  guardar() {
    console.log(this.miFormulario.value)
  }

}
