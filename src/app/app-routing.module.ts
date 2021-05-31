import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SceneComponent } from './scene/scene.component';

const routes: Routes = [
  { path: 'play', component: SceneComponent },
  { path: '', component: SceneComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
