type _SvgPreserveAspectRatioAlignment = 'none' | 'xMinYMin' | 'xMidYMin' | 'xMaxYMin' | 'xMinYMid' | 'xMidYMid' | 'xMaxYMid' | 'xMinYMax' | 'xMidYMax' | 'xMaxYMax';
type _SvgPreserveAspectRatioScale = 'meet' | 'slice';

export type SvgPreserveAspectRatio = `${_SvgPreserveAspectRatioAlignment} ${_SvgPreserveAspectRatioScale}`;