import { type FunctionComponent } from 'react'

import { DeviceManager } from './DeviceManager'
import { observer } from 'mobx-react-lite'
import { MainContent } from './styled-components/MainPageStyles'

export const MainPage = observer(() => (
    <MainContent>
        <DeviceManager />
    </MainContent>
)) satisfies FunctionComponent
