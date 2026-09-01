import { TextBlock } from '@app/models';
import { IsBoolean, IsRecordObject, IsString, IsUndefined } from './general-type-guards';

export function IsTextBlock(value: unknown): value is TextBlock {
    return IsRecordObject(value) && value.elementType === 'text-block' &&
        IsString(value.content) &&
        (IsUndefined(value.illuminated) || IsBoolean(value.illuminated)) &&
        (IsUndefined(value.illuminatedColor) || IsString(value.illuminatedColor)) &&
        (IsUndefined(value.illuminatedBorder) || IsString(value.illuminatedBorder));
}