import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// 디버깅을 위한 로그
console.log('hooks.ts loaded');
console.log('useDispatch:', useDispatch);
console.log('useSelector:', useSelector);

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// 디버깅을 위한 로그
console.log('useAppDispatch exported:', useAppDispatch);
console.log('useAppSelector exported:', useAppSelector);