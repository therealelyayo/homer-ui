import { DashboardModel, ConstValue } from '@app/models';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '@environments/environment';

export interface DashboardEventData {
    current: string;
    currentWidgetList: Array<any>;
    resultWidget?: any;
}

@Injectable({
    providedIn: 'root'
})

export class DashboardService {
    static dbSetting: DashboardEventData = {
        current: '',
        currentWidgetList: [],
        resultWidget: {}
    };
    set dbs (val) {
        DashboardService.dbSetting = val;
    }
    get dbs() {
        return DashboardService.dbSetting;
    }
    private _behavior: BehaviorSubject<any>;
    public dashboardEvent: Observable<any>;
    private url = `${environment.apiUrl}/dashboard`;

    constructor(private _http: HttpClient) {
        this.dbs = JSON.parse(localStorage.getItem(ConstValue.SQWR)) || this.dbs;
        this._behavior = new BehaviorSubject<any>(this.dbs);
        this.dashboardEvent = this._behavior.asObservable();
    }
    clearLocalStorage() {
        this.dbs = {
            current: '',
            currentWidgetList: [],
            resultWidget: {}
        };
    }
    setCurrentDashBoardId(val: any) {
        this.dbs.current = val;
        this.update();
    }

    setWidgetListCurrentDashboard(widgetList: any) {
        this.dbs.currentWidgetList = widgetList;
        this.update();
    }
    setQueryToWidgetResult(id: string, query: string) {
        this.dbs.resultWidget[id] = {
            timestamp: Date.now(),
            query: query
        };
        this.update();
    }
    setSliderQueryDataToWidgetResult(id: string, query: any) {
        this.dbs.resultWidget = this.dbs.resultWidget || {};
        this.dbs.resultWidget[id] = this.dbs.resultWidget[id] || {};
        this.dbs.resultWidget[id].slider = query;
        this.update();
        return query;
    }
    getSliderQueryDataToWidgetResult(id: string) {
        this.dbs = JSON.parse(localStorage.getItem(ConstValue.SQWR)) || this.dbs;
        if (
            this.dbs.resultWidget &&
            this.dbs.resultWidget[id] &&
            this.dbs.resultWidget[id].slider
        ) {
            return this.dbs.resultWidget[id].slider;
        }
        return null;
    }
    update() {
        localStorage.setItem(ConstValue.SQWR, JSON.stringify(this.dbs));
        this._behavior.next(this.dbs);
    }

    getCurrentDashBoardId() {
        return this.dbs.current || 'home';
    }

    // Update json
    updateDashboard(id: string, params): Observable<DashboardModel> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type':  'application/json' })};
        return this._http.put<DashboardModel>(`${this.url}/store/${id}`, params, httpOptions);
    }

    // get Dashboard store
    getDashboardStore(id: string): Observable<any> {
        return this._http.get<any>(`${this.url}/store/${id}`);
    }

    // post Dashboard store
    postDashboardStore(id: string, data: any): Observable<any> {
        return this._http.post<any>(`${this.url}/store/${id}`, data);
    }

    // delete Dashboard store
    deleteDashboardStore(id: string): Observable<any> {
        return this._http.delete<any>(`${this.url}/store/${id}`);
    }

    // Dashboard info
    getDashboardInfo(): Observable<any> {
        return this._http.get<any>(`${this.url}/info`);
    }
}
