import { clsx } from 'clsx'
import Image from 'next/image'
import { TYPOGRAPHY } from '@/lib/typography'

export interface ArticleHeroProps {
  imageSrc: string
  imageAlt: string
  title: string
  label: string
}

/**
 * This component has a two column layout in medium and large screens,
 * and a reversed single column layout in small screens.
 * Please refer to the HTML code in the comment at the bottom of this file for the exact layout.
 *
 * @param imageSrc - The source of the image
 * @param imageAlt - The alt text of the image
 * @param title - The title of the article
 * @param label - The label of the article
 * @returns
 */
export default function ArticleHero({ imageSrc, imageAlt, title, label }: ArticleHeroProps) {
  return (
    <header className="container lg:flex lg:flex-row-reverse lg:flex-nowrap lg:items-center lg:pt-52">
      {/* Text Content Column */}
      <div className="px-4 flex flex-col flex-nowrap py-12 md:py-16 lg:flex-1">
        <h1 className={clsx(TYPOGRAPHY.h1, 'order-2 text-center text-black')}>{title}</h1>
        <p className={clsx(TYPOGRAPHY.bodySmall, 'order-1 mb-5 text-center text-secondary')}>
          {label}
        </p>
      </div>

      {/* Image Column */}
      <div className="relative aspect-2/3 lg:w-5/12 lg:shrink-0">
        <Image src={imageSrc} alt={imageAlt} fill className="object-cover" sizes="50vw" />
      </div>
    </header>
  )
}

/*
<header class="container lg:flex lg:flex-row-reverse lg:flex-nowrap lg:items-center lg:pt-52" data-component="heros:hero-news">
    <div class="px-1-cols flex flex-col flex-nowrap py-48 md:py-64 lg:flex-1">
        <h1 class="f-heading-01 order-2 text-center">
            {title}
        </h1>
        <p class="f-ui-02 order-1 mb-20 text-center text-secondary">
            {label}
        </p>
        </div>
                    <div class="relative aspect-2/3 lg:w-5-cols lg:flex-none">
                <div class="w-full h-full object-cover h-full">


            <div class="relative flex h-full overflow-hidden">
            <div class="twill-image-wrapper  relative overflow-hidden" style="aspect-ratio: 100/149.93; " data-twill-image-wrapper="">
        <picture>
                                    <source type="image/webp" srcset="https://www.hup.harvard.edu/img/5a087dfc-9fa4-4bd0-98f5-45351eed2c0b/The-Color-of-North-cover-illustration.png?fm=webp&amp;q=80&amp;fit=max&amp;crop=677%2C1015%2C83%2C0&amp;w=250 250w, https://www.hup.harvard.edu/img/5a087dfc-9fa4-4bd0-98f5-45351eed2c0b/The-Color-of-North-cover-illustration.png?fm=webp&amp;q=80&amp;fit=max&amp;crop=677%2C1015%2C83%2C0&amp;w=500 500w, https://www.hup.harvard.edu/img/5a087dfc-9fa4-4bd0-98f5-45351eed2c0b/The-Color-of-North-cover-illustration.png?fm=webp&amp;q=80&amp;fit=max&amp;crop=677%2C1015%2C83%2C0&amp;w=750 750w, https://www.hup.harvard.edu/img/5a087dfc-9fa4-4bd0-98f5-45351eed2c0b/The-Color-of-North-cover-illustration.png?fm=webp&amp;q=80&amp;fit=max&amp;crop=677%2C1015%2C83%2C0&amp;w=1000 1000w, https://www.hup.harvard.edu/img/5a087dfc-9fa4-4bd0-98f5-45351eed2c0b/The-Color-of-North-cover-illustration.png?fm=webp&amp;q=80&amp;fit=max&amp;crop=677%2C1015%2C83%2C0&amp;w=1250 1250w, https://www.hup.harvard.edu/img/5a087dfc-9fa4-4bd0-98f5-45351eed2c0b/The-Color-of-North-cover-illustration.png?fm=webp&amp;q=80&amp;fit=max&amp;crop=677%2C1015%2C83%2C0&amp;w=1500 1500w" sizes="(max-width: 699px) calc((((100vw - 120px) / 12) * 12) + 88px), (min-width: 700px) and (max-width: 1023px) calc((((100vw - 184px) / 12) * 10) + 72px), (min-width: 1024px) and (max-width: 1299px) calc((((100vw - 184px) / 12) * 5) + 32px), (min-width: 1300px) and (max-width: 1599px) calc((((100vw - 184px) / 12) * 5) + 32px), 530px">
                            <source type="image/png" srcset="https://www.hup.harvard.edu/img/5a087dfc-9fa4-4bd0-98f5-45351eed2c0b/The-Color-of-North-cover-illustration.png?fm=jpg&amp;q=80&amp;fit=max&amp;crop=677%2C1015%2C83%2C0&amp;w=250 250w, https://www.hup.harvard.edu/img/5a087dfc-9fa4-4bd0-98f5-45351eed2c0b/The-Color-of-North-cover-illustration.png?fm=jpg&amp;q=80&amp;fit=max&amp;crop=677%2C1015%2C83%2C0&amp;w=500 500w, https://www.hup.harvard.edu/img/5a087dfc-9fa4-4bd0-98f5-45351eed2c0b/The-Color-of-North-cover-illustration.png?fm=jpg&amp;q=80&amp;fit=max&amp;crop=677%2C1015%2C83%2C0&amp;w=750 750w, https://www.hup.harvard.edu/img/5a087dfc-9fa4-4bd0-98f5-45351eed2c0b/The-Color-of-North-cover-illustration.png?fm=jpg&amp;q=80&amp;fit=max&amp;crop=677%2C1015%2C83%2C0&amp;w=1000 1000w, https://www.hup.harvard.edu/img/5a087dfc-9fa4-4bd0-98f5-45351eed2c0b/The-Color-of-North-cover-illustration.png?fm=jpg&amp;q=80&amp;fit=max&amp;crop=677%2C1015%2C83%2C0&amp;w=1250 1250w, https://www.hup.harvard.edu/img/5a087dfc-9fa4-4bd0-98f5-45351eed2c0b/The-Color-of-North-cover-illustration.png?fm=jpg&amp;q=80&amp;fit=max&amp;crop=677%2C1015%2C83%2C0&amp;w=1500 1500w" sizes="(max-width: 699px) calc((((100vw - 120px) / 12) * 12) + 88px), (min-width: 700px) and (max-width: 1023px) calc((((100vw - 184px) / 12) * 10) + 72px), (min-width: 1024px) and (max-width: 1299px) calc((((100vw - 184px) / 12) * 5) + 32px), (min-width: 1300px) and (max-width: 1599px) calc((((100vw - 184px) / 12) * 5) + 32px), 530px">
                    
        <img decoding="async" src="https://www.hup.harvard.edu/img/5a087dfc-9fa4-4bd0-98f5-45351eed2c0b/The-Color-of-North-cover-illustration.png?fm=jpg&amp;q=80&amp;fit=max&amp;crop=677%2C1015%2C83%2C0&amp;w=677" loading="lazy" alt="The Color Of North Cover Illustration" class="h-full m-0 max-w-none p-0 w-full object-cover object-center absolute inset-0 object-cover h-full w-full" data-twill-image-main="">
    </picture>
</div>

                    
        </div>
        
    </div>
            </div>
            </header>
*/
