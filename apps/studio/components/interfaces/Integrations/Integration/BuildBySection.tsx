import { Book } from 'lucide-react'
import Link from 'next/link'
import { ComponentPropsWithoutRef, ElementRef, forwardRef, ReactNode } from 'react'
import { cn } from 'ui'

import { IntegrationDefinition } from '../Landing/Integrations.constants'

const hasHostname = (url: string, domain: string) => {
  try {
    const hostname = new URL(url).hostname
    return hostname === domain || hostname.endsWith(`.${domain}`)
  } catch {
    return false
  }
}

const isSupabaseDocsUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url)
    const isSupabaseHostname =
      parsedUrl.hostname === 'supabase.com' || parsedUrl.hostname.endsWith('.supabase.com')
    return isSupabaseHostname && parsedUrl.pathname.startsWith('/docs')
  } catch {
    return false
  }
}

interface BuiltBySectionProps extends ComponentPropsWithoutRef<'div'> {
  integration: IntegrationDefinition
  status?: string | ReactNode
}

export const BuiltBySection = forwardRef<ElementRef<'div'>, BuiltBySectionProps>(
  ({ integration, status, className, ...props }, ref) => {
    const { docsUrl } = integration
    const { name, websiteUrl } = integration?.author ?? {}

    if (!name && !docsUrl && !websiteUrl) return null

    return (
      <div
        ref={ref}
        className={cn('flex flex-wrap items-center gap-8 md:gap-10 px-4 md:px-10', className)}
        {...props}
      >
        {status && (
          <div>
            <div className="text-foreground-lighter font-mono text-xs mb-1">STATUS</div>
            <div>{status}</div>
          </div>
        )}
        {name && (
          <div>
            <div className="text-foreground-lighter font-mono text-xs mb-1">BUILT BY</div>
            <div className="text-foreground-light text-sm">{name}</div>
          </div>
        )}
        {docsUrl && (
          <div>
            <div className="text-foreground-lighter font-mono text-xs mb-1">DOCS</div>
            <Link
              href={docsUrl}
              target="_blank"
              rel="noreferrer"
              className="text-foreground-light hover:text-foreground text-sm flex items-center gap-2"
            >
              <Book size={16} />
              {isSupabaseDocsUrl(docsUrl)
                ? 'Supabase Docs'
                : hasHostname(docsUrl, 'github.com')
                  ? 'GitHub Docs'
                  : 'Documentation'}
            </Link>
          </div>
        )}
        {websiteUrl && (
          <div>
            <div className="text-foreground-lighter font-mono text-xs mb-1">WEBSITE</div>
            <Link
              href={websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="text-foreground-light hover:text-foreground text-sm"
            >
              {websiteUrl.replace('https://', '')}
            </Link>
          </div>
        )}
      </div>
    )
  }
)

BuiltBySection.displayName = 'BuiltBySection'
