import { Component, inject } from '@angular/core';
import { ContactService } from '../../core/services/contact-service';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {

  contactService = inject(ContactService);

  ngOnInit(){
    this.contactService.error404().subscribe({
      
    });
  }

}
