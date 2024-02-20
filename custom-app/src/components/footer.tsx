'use client'

import {
  ComponentConfigContext,
  FooterV30 as SharedFooter,
} from '@devrev/marketing-shared-components'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Footer = ({ list = [], logo, status, compliance, ...rest }: any) => {
  return (
    <ComponentConfigContext.Provider
      value={{
        origin: 'https://devrev.ai',
      }}>
      <div className="w-full">
        <SharedFooter
          className="border-none"
          list={list}
          logo={logo}
          status={status}
          compliance={compliance}
          {...rest}
        />
      </div>
    </ComponentConfigContext.Provider>
  )
}

export default Footer
