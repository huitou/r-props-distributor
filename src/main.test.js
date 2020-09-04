/*
    Main Test.

    Copyright (c) 2019-2020 Riverside Software Engineering Ltd. All rights reserved.

    Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/

import * as models from './composer';

import {
    ReadonlySelectableListModel,
    ReadonlyMultiSelectableListModel,
    SelectableListModel,
    MultiSelectableListModel,
} from './main';

describe('Library main module', () => {
    it('exports the composed models', () => {
        expect(ReadonlySelectableListModel).toBe(models.ReadonlySelectableListModel);
        expect(ReadonlyMultiSelectableListModel).toBe(models.ReadonlyMultiSelectableListModel);
        expect(SelectableListModel).toBe(models.SelectableListModel);
        expect(MultiSelectableListModel).toBe(models.MultiSelectableListModel);
    });
});
