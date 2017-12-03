import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route } from '../../core/route.service';
import { extract } from '../../core/i18n.service';
import { _FEATURE-CAP-NAME_Component } from './component';

const routes: Routes = Route.withShell([
  { path: '_FEATURE-NAME_', component: _FEATURE-CAP-NAME_Component, data: { title: '_FEATURE-NAME_' } }
]);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class _FEATURE-CAP-NAME_RoutingModule { }
