import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import Button from '@/components/ui/Button'
import {
  Download,
  ArrowRight,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Check,
  ExternalLink,
  Mail,
  Share2,
  Heart,
  ShoppingCart,
  Search,
  Settings,
  User,
  LogIn,
  LogOut,
} from 'lucide-react'

export default function ButtonsDemoPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-8">
      <div className="mx-auto max-w-7xl space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className={clsx(TYPOGRAPHY.display1, 'text-foreground')}>Button Component Demo</h1>
          <p className={clsx(TYPOGRAPHY.lead, 'text-muted-foreground')}>
            Comprehensive button component with multiple variants, sizes, and icon support
          </p>
        </div>

        {/* Basic Variants */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Button Variants
          </h2>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
            Six different visual styles for various use cases.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="general">General Button</Button>
            <Button variant="tertiary">Tertiary Button</Button>
            <Button variant="outlined">Outlined Button</Button>
            <Button variant="link">Link Button</Button>
          </div>
        </section>

        {/* Sizes */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Button Sizes
          </h2>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
            Three size options: small, medium (default), and large.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button variant="primary" size="sm">
                Small Button
              </Button>
              <Button variant="primary" size="md">
                Medium Button
              </Button>
              <Button variant="primary" size="lg">
                Large Button
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outlined" size="sm">
                Small Outlined
              </Button>
              <Button variant="outlined" size="md">
                Medium Outlined
              </Button>
              <Button variant="outlined" size="lg">
                Large Outlined
              </Button>
            </div>
          </div>
        </section>

        {/* Leading Icons */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Buttons with Leading Icons
          </h2>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
            Add icons before the button text for enhanced visual communication.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" leadingIcon={Download}>
              Download
            </Button>
            <Button variant="secondary" leadingIcon={Plus}>
              Add New
            </Button>
            <Button variant="general" leadingIcon={Save}>
              Save Changes
            </Button>
            <Button variant="tertiary" leadingIcon={Edit}>
              Edit
            </Button>
            <Button variant="outlined" leadingIcon={Trash2}>
              Delete
            </Button>
            <Button variant="link" leadingIcon={ExternalLink}>
              Open Link
            </Button>
          </div>
        </section>

        {/* Trailing Icons */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Buttons with Trailing Icons
          </h2>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
            Add icons after the button text for directional or action indicators.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" trailingIcon={ArrowRight}>
              Continue
            </Button>
            <Button variant="secondary" trailingIcon={ArrowRight}>
              Next Step
            </Button>
            <Button variant="general" trailingIcon={ExternalLink}>
              Learn More
            </Button>
            <Button variant="tertiary" trailingIcon={ArrowRight}>
              Read Article
            </Button>
            <Button variant="outlined" trailingIcon={ArrowRight}>
              View Details
            </Button>
          </div>
        </section>

        {/* Both Icons */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Buttons with Both Leading and Trailing Icons
          </h2>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
            Combine both icons for maximum visual context.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" leadingIcon={Download} trailingIcon={Check}>
              Download Complete
            </Button>
            <Button variant="secondary" leadingIcon={Mail} trailingIcon={ArrowRight}>
              Send Email
            </Button>
            <Button variant="outlined" leadingIcon={User} trailingIcon={Settings}>
              User Settings
            </Button>
          </div>
        </section>

        {/* Disabled State */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Disabled State
          </h2>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
            All variants support disabled state with reduced opacity.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" disabled>
              Disabled Primary
            </Button>
            <Button variant="secondary" disabled leadingIcon={Plus}>
              Disabled Secondary
            </Button>
            <Button variant="general" disabled trailingIcon={ArrowRight}>
              Disabled General
            </Button>
            <Button variant="tertiary" disabled>
              Disabled Tertiary
            </Button>
            <Button variant="outlined" disabled>
              Disabled Outlined
            </Button>
            <Button variant="link" disabled>
              Disabled Link
            </Button>
          </div>
        </section>

        {/* Full Width */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Full Width Buttons
          </h2>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
            Buttons can span the full width of their container.
          </p>
          <div className="max-w-md space-y-3">
            <Button variant="primary" fullWidth leadingIcon={ShoppingCart}>
              Add to Cart
            </Button>
            <Button variant="secondary" fullWidth leadingIcon={Heart}>
              Add to Wishlist
            </Button>
            <Button variant="outlined" fullWidth leadingIcon={Share2}>
              Share Product
            </Button>
          </div>
        </section>

        {/* Custom Colors */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Custom Colors
          </h2>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
            Override default colors with custom background, text, and border colors.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button backgroundColor="#10b981" textColor="white" leadingIcon={Check}>
              Success
            </Button>
            <Button backgroundColor="#ef4444" textColor="white" leadingIcon={X}>
              Error
            </Button>
            <Button backgroundColor="#f59e0b" textColor="white" leadingIcon={Download}>
              Warning
            </Button>
            <Button backgroundColor="#6366f1" textColor="white" leadingIcon={Mail}>
              Info
            </Button>
            <Button
              backgroundColor="transparent"
              textColor="#10b981"
              borderColor="#10b981"
              className="border"
            >
              Custom Outlined
            </Button>
          </div>
        </section>

        {/* Custom Padding */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Custom Padding
          </h2>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
            Override default padding for precise control over button dimensions.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" padding="0.5rem 1rem">
              Compact
            </Button>
            <Button variant="primary" padding="1rem 2rem">
              Spacious
            </Button>
            <Button variant="primary" padding="1.5rem 3rem">
              Extra Large
            </Button>
          </div>
        </section>

        {/* Common Use Cases */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Common Use Cases
          </h2>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
            Practical examples of button usage in real-world scenarios.
          </p>

          {/* Form Actions */}
          <div className="space-y-4">
            <h3 className={clsx(TYPOGRAPHY.h4, 'text-foreground')}>Form Actions</h3>
            <div className="flex gap-3">
              <Button variant="primary" leadingIcon={Save}>
                Save
              </Button>
              <Button variant="outlined" leadingIcon={X}>
                Cancel
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className={clsx(TYPOGRAPHY.h4, 'text-foreground')}>Navigation</h3>
            <div className="flex gap-3">
              <Button variant="outlined" leadingIcon={ArrowRight} className="rotate-180">
                Previous
              </Button>
              <Button variant="primary" trailingIcon={ArrowRight}>
                Next
              </Button>
            </div>
          </div>

          {/* Authentication */}
          <div className="space-y-4">
            <h3 className={clsx(TYPOGRAPHY.h4, 'text-foreground')}>Authentication</h3>
            <div className="flex gap-3">
              <Button variant="primary" leadingIcon={LogIn}>
                Sign In
              </Button>
              <Button variant="outlined" leadingIcon={User}>
                Sign Up
              </Button>
              <Button variant="link" leadingIcon={LogOut}>
                Sign Out
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="space-y-4">
            <h3 className={clsx(TYPOGRAPHY.h4, 'text-foreground')}>Search</h3>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 px-4 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button variant="primary" leadingIcon={Search}>
                Search
              </Button>
            </div>
          </div>

          {/* Card Actions */}
          <div className="space-y-4">
            <h3 className={clsx(TYPOGRAPHY.h4, 'text-foreground')}>Card Actions</h3>
            <div className="max-w-sm p-6 border border-border rounded-lg space-y-4">
              <h4 className={clsx(TYPOGRAPHY.h3, 'text-foreground')}>Product Title</h4>
              <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
                Brief product description goes here with key features and benefits.
              </p>
              <div className="flex gap-3">
                <Button variant="primary" fullWidth leadingIcon={ShoppingCart}>
                  Add to Cart
                </Button>
              </div>
              <div className="flex gap-3">
                <Button variant="outlined" fullWidth leadingIcon={Heart}>
                  Save
                </Button>
                <Button variant="outlined" fullWidth leadingIcon={Share2}>
                  Share
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Size Comparison Grid */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Complete Variant & Size Matrix
          </h2>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
            All combinations of variants and sizes.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className={clsx(TYPOGRAPHY.bodyBase, 'text-left p-4')}>Variant</th>
                  <th className={clsx(TYPOGRAPHY.bodyBase, 'text-center p-4')}>Small</th>
                  <th className={clsx(TYPOGRAPHY.bodyBase, 'text-center p-4')}>Medium</th>
                  <th className={clsx(TYPOGRAPHY.bodyBase, 'text-center p-4')}>Large</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className={clsx(TYPOGRAPHY.bodyBase, 'p-4')}>Primary</td>
                  <td className="text-center p-4">
                    <Button variant="primary" size="sm" leadingIcon={Plus}>
                      Button
                    </Button>
                  </td>
                  <td className="text-center p-4">
                    <Button variant="primary" size="md" leadingIcon={Plus}>
                      Button
                    </Button>
                  </td>
                  <td className="text-center p-4">
                    <Button variant="primary" size="lg" leadingIcon={Plus}>
                      Button
                    </Button>
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className={clsx(TYPOGRAPHY.bodyBase, 'p-4')}>Secondary</td>
                  <td className="text-center p-4">
                    <Button variant="secondary" size="sm" trailingIcon={ArrowRight}>
                      Button
                    </Button>
                  </td>
                  <td className="text-center p-4">
                    <Button variant="secondary" size="md" trailingIcon={ArrowRight}>
                      Button
                    </Button>
                  </td>
                  <td className="text-center p-4">
                    <Button variant="secondary" size="lg" trailingIcon={ArrowRight}>
                      Button
                    </Button>
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className={clsx(TYPOGRAPHY.bodyBase, 'p-4')}>General</td>
                  <td className="text-center p-4">
                    <Button variant="general" size="sm">
                      Button
                    </Button>
                  </td>
                  <td className="text-center p-4">
                    <Button variant="general" size="md">
                      Button
                    </Button>
                  </td>
                  <td className="text-center p-4">
                    <Button variant="general" size="lg">
                      Button
                    </Button>
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className={clsx(TYPOGRAPHY.bodyBase, 'p-4')}>Tertiary</td>
                  <td className="text-center p-4">
                    <Button variant="tertiary" size="sm">
                      Button
                    </Button>
                  </td>
                  <td className="text-center p-4">
                    <Button variant="tertiary" size="md">
                      Button
                    </Button>
                  </td>
                  <td className="text-center p-4">
                    <Button variant="tertiary" size="lg">
                      Button
                    </Button>
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className={clsx(TYPOGRAPHY.bodyBase, 'p-4')}>Outlined</td>
                  <td className="text-center p-4">
                    <Button variant="outlined" size="sm">
                      Button
                    </Button>
                  </td>
                  <td className="text-center p-4">
                    <Button variant="outlined" size="md">
                      Button
                    </Button>
                  </td>
                  <td className="text-center p-4">
                    <Button variant="outlined" size="lg">
                      Button
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className={clsx(TYPOGRAPHY.bodyBase, 'p-4')}>Link</td>
                  <td className="text-center p-4">
                    <Button variant="link" size="sm">
                      Button
                    </Button>
                  </td>
                  <td className="text-center p-4">
                    <Button variant="link" size="md">
                      Button
                    </Button>
                  </td>
                  <td className="text-center p-4">
                    <Button variant="link" size="lg">
                      Button
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
