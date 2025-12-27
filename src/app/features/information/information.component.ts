import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IdentityService } from '../../services/identity.service';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {
  dossierForm: FormGroup;

  constructor(private fb: FormBuilder, public identity: IdentityService) {
    this.dossierForm = this.fb.group({
      fullName: [{value: '', disabled: true}],
      systemUID: [{value: '', disabled: true}],
      assignedIPNode: [''],
      clearanceLevel: ['']
    });
  }

  ngOnInit() {
    this.identity.user$.subscribe(user => {
      this.dossierForm.patchValue({
        fullName: user.name,
        systemUID: user.uid,
        assignedIPNode: user.ipNode,
        clearanceLevel: user.clearance
      });
    });
  }
}
