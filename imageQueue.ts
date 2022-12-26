import {
  // BehaviorSubject,
  filter, mergeMap, Observable, Subject, tap, zip,
} from 'rxjs';
import { LoadImageEvent, ImageTypes, Params } from './types';

export const queueCreate = <P, R>(
  imageRequestQueue$: Observable<LoadImageEvent<P, R>>,
  imageWorkersQueue$: Subject<ImageTypes>,
  imageType: ImageTypes,
) => new Observable<R>((subsrive) => {
    zip(
      imageRequestQueue$.pipe(filter((imageEvent) => imageEvent.type === imageType)),
      imageWorkersQueue$.pipe(filter((worker) => worker === imageType)),
    )
      .pipe(
        mergeMap(async ([imageEvent]) => [imageEvent]),
        mergeMap(
          ([imageEvent]) => imageEvent.run(imageEvent.data),
        ),
        tap(() => imageWorkersQueue$.next(imageType)),
      )
      .subscribe((next) => {
        subsrive.next(next);
      });
  });
