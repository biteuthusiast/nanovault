import { Component, OnInit } from '@angular/core';
import {WalletService} from "../../services/wallet.service";
import {ModalService} from "../../services/modal.service";
import {AddressBookService} from "../../services/address-book.service";
import {ApiService} from "../../services/api.service";
import {NotificationService} from "../../services/notification.service";
import {AppSettingsService} from "../../services/app-settings.service";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  accountHistory: any[] = [];
  pageSize = 25;
  maxPageSize = 200;
  currentAccount = '';

  accounts = this.walletService.wallet.accounts;

  searchPerformed = false;

  constructor(private walletService: WalletService, public modal: ModalService, private addressBook: AddressBookService, private api: ApiService, private notifications: NotificationService, public settings: AppSettingsService) { }

  async ngOnInit() {
  }

  async getAccountHistory(account, resetPage = true) {
    if (resetPage) {
      this.pageSize = 25;
    }
    this.searchPerformed = true;
    this.currentAccount = account;

    const history = await this.api.accountHistory(account, this.pageSize);
    if (history && history.history && Array.isArray(history.history)) {
      this.accountHistory = history.history.map(h => {
        h.addressBookName = this.addressBook.getAccountName(h.account) || null;
        return h;
      });
    } else {
      this.accountHistory = [];
    }
  }

  async loadMore() {
    if (this.pageSize <= this.maxPageSize) {
      this.pageSize += 25;
      await this.getAccountHistory(this.currentAccount, false);
    }
  }

  copied() {
    this.notifications.sendSuccess(`Successfully copied to clipboard!`);
  }

}
