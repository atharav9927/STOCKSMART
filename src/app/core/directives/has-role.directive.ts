import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy, effect } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models';

@Directive({
  selector: '[appHasRole]',
  standalone: true,
})
export class HasRoleDirective implements OnInit {
  @Input('appHasRole') roles: UserRole | UserRole[] = [];

  private hasView = false;

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private auth: AuthService,
  ) {
    effect(() => {
      this.updateView();
    });
  }

  ngOnInit(): void {
    this.updateView();
  }

  private updateView(): void {
    const roleArray = Array.isArray(this.roles) ? this.roles : [this.roles];
    const hasRole = this.auth.hasRole(...roleArray);

    if (hasRole && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasRole && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
