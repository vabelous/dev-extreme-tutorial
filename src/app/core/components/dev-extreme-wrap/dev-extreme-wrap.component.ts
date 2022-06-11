import { 
  Component, 
  OnDestroy, 
  ContentChild, 
  Input, 
  AfterContentInit, 
  ChangeDetectionStrategy 
} from '@angular/core';
import { 
  DxChartComponent, 
  DxDataGridComponent, 
  DxGanttComponent, 
  DxPieChartComponent, 
  DxTreeListComponent 
} from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { 
  Observable, 
  Subject 
} from 'rxjs';
import {
  catchError,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { ICallBackFunctions } from '@app-core/interfaces/core.models';

@Component({
  selector: 'pmc-dev-extreme-wrap',
  templateUrl: './dev-extreme-wrap.component.html',
  styleUrls: ['./dev-extreme-wrap.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevExtremeWrapComponent implements OnDestroy, AfterContentInit {

  /** Subject that emits when the component has been destroyed. */
  private _onDestroy$ = new Subject<void>();

  @ContentChild(DxChartComponent)
  private dxChart: DxChartComponent;

  @ContentChild(DxPieChartComponent)
  private pieChart: DxPieChartComponent;

  @ContentChild(DxDataGridComponent)
  private dataGrid: DxDataGridComponent;

  @ContentChild(DxTreeListComponent)
  private treeList: DxTreeListComponent;

  @Input()
  private dataSource$: Observable< CustomStore | DataSource | []> | undefined;

  @Input()
  private configuration$: Observable<Partial<DxDataGridComponent | DxTreeListComponent | DxGanttComponent>> | undefined;

  @Input()
  private functions$: Observable<ICallBackFunctions> | undefined;

  constructor() {}

  ngAfterContentInit(): void {

    const chart: DxChartComponent | DxPieChartComponent | DxDataGridComponent | DxTreeListComponent = this.dxChart || this.pieChart || this.dataGrid || this.treeList;

    this.configuration$
      ?.pipe(
        tap((configuration) => chart.instance.option(JSON.parse(JSON.stringify(configuration)))),
        catchError((err) => {
          throw new Error(`Dev Extreme Wrap Component. Ошибка в методе ngAfterContentInit(). Тип ошибки: ошибка данных переданных методу инициализации конфигурации компонента. ${err}`);
        }),
        takeUntil(this._onDestroy$)
      )
      .subscribe()

    this.functions$
      ?.pipe(
        tap((functions) => chart.instance.option(functions)),
        catchError(() => {
          throw new Error('Dev Extreme Wrap Component. Ошибка в методе ngAfterContentInit(). Тип ошибки: ошибка данных переданных методу инициализации функций обратного вызова компонента \'chart\'.');
        }),
        takeUntil(this._onDestroy$)
      )
      .subscribe()

    this.dataSource$
      ?.pipe(
        tap((dataSource) => chart.instance.option({ dataSource: dataSource })),
        takeUntil(this._onDestroy$)
      )
      .subscribe()
  }

  ngOnDestroy(): void {
    this._onDestroy$.next();
  }

}
