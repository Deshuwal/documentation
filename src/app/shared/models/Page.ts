export class Page{


    public totalItemCount:number = 5000;
    public currentPage: number = 0;
    public displayPerPageCount: number  = 50;


    public  setTotalItemCount(n: number){

        this.totalItemCount = n;
    }



    public setCurrentPage(n: number){

        this.currentPage = n;
    }


    public setDisplayPerPageCount(n: number){

        this.displayPerPageCount = n;
    }
}