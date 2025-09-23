import { Component, ElementRef, input, model, output, ViewChild} from '@angular/core';
import { MemberParams } from '../../../Types/member';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filters-modal',
  imports: [FormsModule],
  templateUrl: './filters-modal.html',
  styleUrl: './filters-modal.css'
})
export class FiltersModal {
  @ViewChild('filterModal') modalRef!: ElementRef<HTMLDialogElement>;

  closeModal = output();
  submitData = output<MemberParams>();
  memberParams = model(new MemberParams());

constructor(){
    const filters = localStorage.getItem('filters');
    if(filters){
      this.memberParams.set(JSON.parse(filters));
    }
}

  open(){
    this.modalRef.nativeElement.showModal();
  }
  close(){
    this.modalRef.nativeElement.close();
    this.closeModal.emit();
  }
  submit(){
    this.submitData.emit(this.memberParams());
    this.close();
  }

  onMinAgeChange(){
    if(this.memberParams().minAge < 18) this.memberParams().minAge =18;

  }
  onMaxAgeChange(){
    if(this.memberParams().maxAge < this.memberParams().minAge){
      this.memberParams().maxAge = this.memberParams().minAge
    }
  }
}

