import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JwtService } from '../../service/JwtService';
import { UserService } from '../../repository/user/user.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
})
export class SidenavComponent implements OnInit {
  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) {}
  username: any = 'hello world';

  ngOnInit(): void {
    this.username = this.jwtService.getUsername();
    initFlowbite();
  }
  logOut() {
    this.userService.logoutUser();
  }
}
