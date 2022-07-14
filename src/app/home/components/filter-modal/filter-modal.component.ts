import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { IonModal, IonPopover } from '@ionic/angular';
import { Filterables } from 'src/app/models/filterables';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent {
  private _isOpen: boolean = false;
  @Input('isOpen') set isOpen(value) {
    if (value) {
      this.getFromDB();
      this.newFilterables = new Filterables();
    }
    this._isOpen = value;
  }
  get isOpen() {
    return this._isOpen;
  }
  @Output('onClose') onClose = new EventEmitter();

  @ViewChild(IonModal) modal: IonModal;

  newFilterables: Filterables;
  departments = [];
  positions = [];

  constructor(private databaseService: DatabaseService) {
    this.newFilterables = new Filterables();
  }

  async getFromDB() {
    this.departments = await this.databaseService.getExistingDepartments();
    this.positions = await this.databaseService.getExistingPositions();
  }

  cancel(): void {
    this.modal.dismiss(null, 'cancel');
    this.onClose.emit(null);
  }

  confirm(): void {
    this.modal.dismiss(this.newFilterables, 'confirm');
    this.onClose.emit(this.newFilterables);
  }

  onDepartmentSelect(event) {
    this.newFilterables.department = event.target.value;
  }

  onPositionSelect(event) {
    this.newFilterables.position = event.target.value;
  }
}
