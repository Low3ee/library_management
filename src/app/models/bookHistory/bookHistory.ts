export interface HistoryResponse {
  message: any;
  data: BookHistory;
}

interface BookHistory {
  id: any;
  user_id: any;
  bookId: any;
  date_borrowed: any;
  date_due: any;
  returned: any;
  fine: any;
  remarks: any;
}
