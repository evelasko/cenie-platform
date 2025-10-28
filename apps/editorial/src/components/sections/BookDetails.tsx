'use client'

import { clsx } from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { TYPOGRAPHY } from '@/lib/typography'
import { useState } from 'react'

export interface BookDetailsProps {
  bookTitle: string
  bookAuthor: {
    name: string
    link: string
  }[]
  bookEditor?: string[] | undefined
  bookPublicationDate: string
  bookISBN: string
  bookCoverSrc: string
  lookInsideLink?: string | undefined
  buyElsewhereLinks?: {
    label: string
    link: string
  }[]
  buyHereLink?: {
    format: string
    price: string
    currency: string
    link: string
  }[]
}

/**
 * Please refer to the HTML code in the comment at the bottom of this file for the exact layout.
 * The book title is displayed as TYPOGRAPHY.display1 in black.
 * The book author is displayed TYPOGRAPHY.h3 in black 60% opacity.
 * The book editor is displayed TYPOGRAPHY.h3 in black 60% opacity.
 * The book publication date is displayed TYPOGRAPHY.h5 in black 60% opacity.
 * The book ISBN is displayed TYPOGRAPHY.h5 in black 60% opacity.
 * The look inside link is displayed as a link to the look inside page.
 * The buy elsewhere links are displayed as a list of buttons to the buy elsewhere page.
 * The buy here link is displayed as a button to the buy here page. The contents of this button's label depends on which format is selected.
 * The format selector is displayed TYPOGRAPHY.bodyBase in black 90% opacity.
 */
export default function BookDetails({
  bookTitle,
  bookAuthor,
  bookEditor,
  bookPublicationDate,
  bookISBN,
  bookCoverSrc,
  lookInsideLink,
  buyElsewhereLinks,
  buyHereLink,
}: BookDetailsProps) {
  const [selectedFormat, setSelectedFormat] = useState(0)
  const [showBuyElsewhere, setShowBuyElsewhere] = useState(false)

  return (
    <header className="container grid grid-cols-12 gap-y-12 md:gap-y-16 pt-4 md:pt-12">
      {/* Cover Image Column */}
      <div className="col-span-12 md:col-span-10 md:col-start-2 lg:col-span-6 lg:col-start-1">
        <div className="relative flex aspect-343/468 items-center justify-center bg-muted md:aspect-square lg:aspect-460/620 xl:aspect-638/680">
          {/* Book Cover */}
          <div className="w-11/25">
            <div className="relative aspect-2/3 flex items-center">
              <Image
                src={bookCoverSrc}
                alt={bookTitle}
                fill
                className="object-contain"
                sizes="30vw"
              />
            </div>
          </div>

          {/* Look Inside Link */}
          {lookInsideLink && (
            <p className="absolute bottom-4 left-4">
              <Link
                href={lookInsideLink}
                target="_blank"
                className={clsx(
                  TYPOGRAPHY.bodyBase,
                  'inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors'
                )}
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20" aria-hidden="true">
                  <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
                  <line x1="10" y1="6" x2="10" y2="14" stroke="currentColor" strokeWidth="2" />
                  <line x1="6" y1="10" x2="14" y2="10" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span>Look inside</span>
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* Book Details Column */}
      <div className="col-span-12 md:col-span-10 md:col-start-2 lg:col-span-6 lg:col-start-7 lg:flex lg:items-center lg:justify-center lg:py-11">
        <div className="w-full lg:ml-6 lg:max-w-[360px]">
          {/* Title */}
          <h1 className={clsx(TYPOGRAPHY.display1, 'mb-3 text-black')}>{bookTitle}</h1>

          {/* Authors */}
          <div className="mb-1">
            {bookAuthor.map((author, index) => (
              <span key={index}>
                <Link
                  href={author.link}
                  className={clsx(
                    TYPOGRAPHY.h3,
                    'text-black/60 hover:text-primary transition-colors whitespace-nowrap'
                  )}
                >
                  {author.name}
                </Link>
                {index < bookAuthor.length - 1 && <span className="text-black/60">, </span>}
              </span>
            ))}
          </div>

          {/* Editor (if provided) */}
          {bookEditor && bookEditor.length > 0 && (
            <p className={clsx(TYPOGRAPHY.h3, 'text-black/60')}>
              Edited by {bookEditor.join(', ')}
            </p>
          )}

          {/* Format Selector */}
          {buyHereLink && buyHereLink.length > 0 && (
            <ul className="grid grid-cols-2 gap-2 mt-8">
              {buyHereLink.map((format, index) => (
                <li key={index} className="col-span-1">
                  <button
                    onClick={() => setSelectedFormat(index)}
                    className={clsx(
                      TYPOGRAPHY.bodyBase,
                      'inline-flex items-center gap-2 grow w-full',
                      selectedFormat === index ? 'text-primary' : 'text-black/90'
                    )}
                  >
                    <span
                      className={clsx(
                        'inline-flex h-3 w-3 shrink-0 rounded-full border',
                        selectedFormat === index ? 'bg-primary border-secondary' : 'border-border'
                      )}
                    />
                    <span className="shrink-0">{format.format}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Purchase Buttons */}
          <div className="mt-6">
            {/* Buy Here Button */}
            {buyHereLink && buyHereLink.length > 0 && (
              <Link
                href={buyHereLink[selectedFormat].link}
                className={clsx(
                  TYPOGRAPHY.bodyBase,
                  'flex items-center justify-between w-full px-4 py-3 bg-primary text-white hover:bg-primary/90 transition-colors'
                )}
              >
                <span>Add to shopping bag</span>
                <span className="ml-1">
                  {buyHereLink[selectedFormat].currency} {buyHereLink[selectedFormat].price}
                </span>
              </Link>
            )}

            {/* Buy Elsewhere Dropdown */}
            {buyElsewhereLinks && buyElsewhereLinks.length > 0 && (
              <div className="relative mt-3">
                <button
                  onClick={() => setShowBuyElsewhere(!showBuyElsewhere)}
                  className={clsx(
                    TYPOGRAPHY.bodyBase,
                    'px-4 py-3 w-full flex items-center justify-between bg-white shadow hover:text-secondary transition-colors'
                  )}
                >
                  Buy elsewhere
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M9 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                {showBuyElsewhere && (
                  <div className="absolute w-full z-50 bg-white shadow-lg rounded-sm mt-5 left-0">
                    <ul className="p-5 space-y-3">
                      {buyElsewhereLinks.map((link, index) => (
                        <li key={index}>
                          <Link
                            href={link.link}
                            target="_blank"
                            className={clsx(
                              TYPOGRAPHY.bodyBase,
                              'flex items-center justify-between w-full hover:text-primary transition-colors'
                            )}
                          >
                            <span>{link.label}</span>
                            <svg
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            </svg>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="mt-10">
            <p className={clsx(TYPOGRAPHY.h5, 'text-black/60')}>ISBN {bookISBN}</p>
            <p className={clsx(TYPOGRAPHY.h5, 'text-black/60')}>
              Publication date: {bookPublicationDate}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

/*!SECTION<header class="container grid-layout gap-y-48 pt-16 md:gap-y-64 md:pt-48" data-component="heros:hero-product">
    <div class="grid-col-span-12 md:grid-col-span-10 md:grid-col-start-2 lg:grid-col-span-6 lg:grid-col-start-1">
        <div class="relative flex aspect-[343/468] items-center justify-center bg-light md:aspect-1/1 lg:aspect-[460/620] xl:aspect-[638/680]">
            <div class="w-[44%]">
                <div class="flex-none">
        <div class="items-center aspect-2/3 relative flex">
            <img class="cover-img  mx-auto flex-grow h-full max-h-full min-h-[3px] w-full min-w-[2px] object-contain" data-productimages-item="" itemprop="image" alt="This Craft of Verse" sizes="30vw" srcset="https://www.hup.harvard.edu/img/feeds/jackets/9780674302457.png?fm=jpg&amp;q=80&amp;fit=max&amp;w=50 50w, https://www.hup.harvard.edu/img/feeds/jackets/9780674302457.png?fm=jpg&amp;q=80&amp;fit=max&amp;w=100 100w, https://www.hup.harvard.edu/img/feeds/jackets/9780674302457.png?fm=jpg&amp;q=80&amp;fit=max&amp;w=200 200w, https://www.hup.harvard.edu/img/feeds/jackets/9780674302457.png?fm=jpg&amp;q=80&amp;fit=max&amp;w=400 400w, https://www.hup.harvard.edu/img/feeds/jackets/9780674302457.png?fm=jpg&amp;q=80&amp;fit=max&amp;w=600 600w, https://www.hup.harvard.edu/img/feeds/jackets/9780674302457.png?fm=jpg&amp;q=80&amp;fit=max&amp;w=800 800w, https://www.hup.harvard.edu/img/feeds/jackets/9780674302457.png?fm=jpg&amp;q=80&amp;fit=max&amp;w=1200 1200w, https://www.hup.harvard.edu/img/feeds/jackets/9780674302457.png?fm=jpg&amp;q=80&amp;fit=max&amp;w=1600 1600w, https://www.hup.harvard.edu/img/feeds/jackets/9780674302457.png?fm=jpg&amp;q=80&amp;fit=max&amp;w=2000 2000w" src="https://www.hup.harvard.edu/img/feeds/jackets/9780674302457.png?fm=jpg&amp;q=80&amp;fit=max&amp;w=200" data-loaded="true">
                    </div>
    </div>
            </div>

                            <p class="absolute bottom-16 left-16">
                    <a class="inline-flex inline-flex items-center gap-8 f-body-02 text-secondary relative hover:text-primary focus-visible:text-primary before:effect-opacity before:opacity-0 hover:before:opacity-100 before:content-[''] before:bg-light before:z-0 before:absolute before:-inset-y-2 before:rounded-lg after:effect-opacity after:opacity-0 after:content-[''] after:z-0 after:absolute after:-inset-y-4 after:rounded-lg after:border-secondary after:border-2 focus:outline-none focus-visible:rounded-lg focus-visible:before:opacity-100 focus-visible:after:opacity-100 mr-2 before:-left-4 before:-right-8 after:-left-6 after:-right-10 mt-8" data-tracking-item="" data-tracking-event="look-inside" data-tracking-isbn="9780674302457" href="https://www.hup.harvard.edu/file/feeds/PDF/9780674302457_sample.pdf" target="_blank">

            <svg width="20" height="20" fill="none" class="z-1 relative" viewBox="0 0 20 20" aria-hidden="true">
    <use xlink:href="#plus-20"></use>
</svg>
    
            <span class="text-inherit z-1 relative inline-flex items-center">Look inside</span>
    
        </a>
                </p>
                    </div>
    </div>
    <div class="xl:py-70 grid-col-span-12 md:grid-col-span-10 md:grid-col-start-2 lg:grid-col-span-6 lg:grid-col-start-7 lg:flex lg:items-center lg:justify-center lg:py-44">
        <div class="w-full lg:ml-24 lg:max-w-[360px]">
            <h1 class="f-heading-03 mb-12">This Craft of Verse</h1>
                                        <p class="f-body-01 mb-4 text-secondary"><a class="text-secondary hover:text-primary effect-focus effect-color whitespace-nowrap" href="https://www.hup.harvard.edu/authors/2173-borges-jorge-luis">Jorge Luis Borges</a></p>
                                        <p class="f-body-01 text-secondary">Edited by Calin-Andrei Mihailescu</p>
                        <ul class="grid grid-cols-2 gap-8 mt-32">
                    <li class="col-span-1">
                <a class="inline-flex inline-flex items-center gap-8 f-body-02 text-secondary hover:text-primary effect-focus effect-color group/link !text-primary flex grow items-center" href="https://www.hup.harvard.edu/books/9780674302457">

    
            <span class="text-inherit z-1 relative inline-flex items-center"><span class="effect-color bg-primary border-secondary mr-8 mt-1 inline-flex h-12 w-12 shrink-0 rounded-full border group-hover/link:border-secondary group-hover/link:bg-primary"></span>

    <span class="shrink-0">Hardcover</span></span>
    
        </a>
            </li>
                    <li class="col-span-1">
                <a class="inline-flex inline-flex items-center gap-8 f-body-02 text-secondary hover:text-primary effect-focus effect-color group/link  flex grow items-center" href="https://www.hup.harvard.edu/books/9780674302938">

    
            <span class="text-inherit z-1 relative inline-flex items-center"><span class="effect-color border-tertiary mr-8 mt-1 inline-flex h-12 w-12 shrink-0 rounded-full border group-hover/link:border-secondary group-hover/link:bg-primary"></span>

    <span class="shrink-0">eBook</span></span>
    
        </a>
            </li>
            </ul>
            <div>
                <div class="mt-24 min-h-48 w-full" data-behavior="purchase" data-purchase-title="This Craft of Verse" data-purchase-isbn13="9780674302457" data-purchase-isbn10="0674302451" data-purchase-price="$22.95" data-purchase-prices="{&quot;us&quot;:&quot;$22.95&quot;,&quot;eu&quot;:&quot;20,95\u00a0\u20ac&quot;,&quot;uk&quot;:&quot;\u00a319.95&quot;}" data-purchase-sellable="1" data-purchase-countries="AD:AE:AF:AG:AI:AL:AM:AO:AQ:AR:AS:AT:AU:AW:AX:AZ:BA:BB:BD:BE:BF:BG:BH:BI:BJ:BL:BM:BN:BO:BQ:BR:BS:BT:BV:BW:BY:BZ:CA:CC:CD:CF:CG:CH:CI:CK:CL:CM:CN:CO:CR:CU:CV:CW:CX:CY:CZ:DE:DJ:DK:DM:DO:DZ:EC:EE:EG:EH:ER:ES:ET:FI:FJ:FK:FM:FO:FR:GA:GB:GD:GE:GF:GG:GH:GI:GL:GM:GN:GP:GQ:GR:GS:GT:GU:GW:GY:HK:HM:HN:HR:HT:HU:ID:IE:IL:IM:IN:IO:IQ:IR:IS:IT:JE:JM:JO:JP:KE:KG:KH:KI:KM:KN:KP:KR:KW:KY:KZ:LA:LB:LC:LI:LK:LR:LS:LT:LU:LV:LY:MA:MC:MD:ME:MF:MG:MH:MK:ML:MM:MN:MO:MP:MQ:MR:MS:MT:MU:MV:MW:MX:MY:MZ:NA:NC:NE:NF:NG:NI:NL:NO:NP:NR:NU:NZ:OM:PA:PE:PF:PG:PH:PK:PL:PM:PN:PR:PS:PT:PW:PY:QA:RE:RO:RS:RU:RW:SA:SB:SC:SD:SE:SG:SH:SI:SJ:SK:SL:SM:SN:SO:SR:SS:ST:SV:SX:SY:SZ:TC:TD:TF:TG:TH:TJ:TK:TL:TM:TN:TO:TR:TT:TV:TW:TZ:UA:UG:UM:US:UY:UZ:VA:VC:VE:VG:VI:VN:VU:WF:WS:YE:YT:ZA:ZM:ZW" data-purchase-label="Add to shopping bag" data-purchase-preorder="" data-purchase-preorderlabel="Pre-order Now" data-purchase-preorderamazon="" data-purchase-instock="1" data-purchase-format="Hardcover" data-component="products:product-purchase">
        <button class="flex items-center gap-10 effect-color effect-focus disabled:cursor-not-allowed px-16 py-12 bg-primary text-inverse hover:bg-accent-darker disabled:bg-lighter disabled:text-soft f-ui-02 w-fit w-full justify-between" data-purchase-btn="">

    
            <span class="flex items-center justify-between w-full"><span data-purchase-btnlabel="">Add to shopping bag</span>
                            <span class="ml-4" data-purchase-btnprice="">£19.95 • 20,95&nbsp;€</span></span>
    
        </button>
        <p class="f-ui-02 text-error" data-purchase-india="" hidden="">
            Harvard University Press books are not shipped directly to India due to regional distribution arrangements. Buy from your local bookstore, Amazon.co.in, or Flipkart.com.
        </p>
        <p class="f-ui-02 text-error" data-purchase-row="" hidden="">
            This book is not shipped directly to <span data-purchase-rowname="">country</span> due to regional distribution arrangements.
        </p>
        <p class="f-ui-02 pb-12 text-error" data-purchase-preorderamazon="" hidden="">
            Pre-order for this book isn't available yet on our website.
        </p>
        <p class="f-ui-02 pb-12 text-error" data-purchase-outofstock="" hidden="">
            This book is currently out of stock.
        </p>
        <p class="pb-12" hidden="" inert="">
            <button class="inline-flex inline-flex items-center gap-8 f-body-02 text-secondary hover:text-accent effect-focus effect-color underline-thickness-1 underline underline-offset-3" data-purchase-editlocation="data-purchase-editlocation">

    
            <span class="text-inherit z-1 relative inline-flex items-center">Edit shipping location</span>
    
        </button>
        </p>
    </div>
                            <div class="mt-12 w-full first:mt-24" data-behavior="buyelsewhere" data-buyelsewhere-countries="AD:AE:AF:AG:AI:AL:AM:AO:AQ:AR:AS:AT:AU:AW:AX:AZ:BA:BB:BD:BE:BF:BG:BH:BI:BJ:BL:BM:BN:BO:BQ:BR:BS:BT:BV:BW:BY:BZ:CA:CC:CD:CF:CG:CH:CI:CK:CL:CM:CN:CO:CR:CU:CV:CW:CX:CY:CZ:DE:DJ:DK:DM:DO:DZ:EC:EE:EG:EH:ER:ES:ET:FI:FJ:FK:FM:FO:FR:GA:GB:GD:GE:GF:GG:GH:GI:GL:GM:GN:GP:GQ:GR:GS:GT:GU:GW:GY:HK:HM:HN:HR:HT:HU:ID:IE:IL:IM:IN:IO:IQ:IR:IS:IT:JE:JM:JO:JP:KE:KG:KH:KI:KM:KN:KP:KR:KW:KY:KZ:LA:LB:LC:LI:LK:LR:LS:LT:LU:LV:LY:MA:MC:MD:ME:MF:MG:MH:MK:ML:MM:MN:MO:MP:MQ:MR:MS:MT:MU:MV:MW:MX:MY:MZ:NA:NC:NE:NF:NG:NI:NL:NO:NP:NR:NU:NZ:OM:PA:PE:PF:PG:PH:PK:PL:PM:PN:PR:PS:PT:PW:PY:QA:RE:RO:RS:RU:RW:SA:SB:SC:SD:SE:SG:SH:SI:SJ:SK:SL:SM:SN:SO:SR:SS:ST:SV:SX:SY:SZ:TC:TD:TF:TG:TH:TJ:TK:TL:TM:TN:TO:TR:TT:TV:TW:TZ:UA:UG:UM:US:UY:UZ:VA:VC:VE:VG:VI:VN:VU:WF:WS:YE:YT:ZA:ZM:ZW" data-component="products:product-buy-elsewhere">
        <div class="relative group" data-buyelsewhere-dropdown="" data-behavior="Dropdown">
    <button class="px-16 py-12 w-full flex items-center justify-between bg-inverse shadow-01 hover:text-secondary disabled:bg-lighter disabled:text-soft f-ui-02" type="button" aria-label="Buy elsewhere" data-dropdown-btn="">
        Buy elsewhere

        <svg width="24" height="24" fill="none" class="w-24 h-24" data-dropdown-chevron="data-dropdown-chevron" viewBox="0 0 24 24" aria-hidden="true">
    <use xlink:href="#arrow-right-24"></use>
</svg>
    </button>

    <div class="absolute w-full z-9999 bg-inverse shadow-01 rounded-xs mt-20 left-0 translate-y-20 opacity-0 effect-hidden-fade-translate group-data-[is-open]:effect-show-fade-translate group-data-[is-open]:opacity-100 group-data-[is-open]:translate-y-0" data-dropdown-list="">
        <h3 id="DropdownLabelj4xy5" class="sr-only">Dropdown items</h3>

        <ul aria-labelledby="DropdownLabelj4xy5" class="p-20 space-y-12">
            <li data-buyelsewhere-item="" data-buyelsewhere-countries="!IN">
                    <a class="inline-flex inline-flex items-center gap-8 f-ui-02 block w-full hover:text-accent flex flex-row flex-nowrap justify-between before:-left-8 before:-right-4 after:-left-10 after:-right-6" href="https://www.amazon.com/gp/product/0674302451" target="_blank">

    
            <span class="text-inherit z-1 relative inline-flex items-center">Amazon</span>
    
            <svg width="24" height="24" fill="none" class="z-1 relative" viewBox="0 0 24 24" aria-hidden="true">
    <use xlink:href="#external-24"></use>
</svg>
        </a>
                </li>
                                    <li data-buyelsewhere-item="" data-buyelsewhere-countries="!IN">
                        <a class="inline-flex inline-flex items-center gap-8 f-ui-02 block w-full hover:text-accent flex flex-row flex-nowrap justify-between before:-left-8 before:-right-4 after:-left-10 after:-right-6" href="http://www.barnesandnoble.com/s/9780674302457" target="_blank">

    
            <span class="text-inherit z-1 relative inline-flex items-center">Barnes and Noble</span>
    
            <svg width="24" height="24" fill="none" class="z-1 relative" viewBox="0 0 24 24" aria-hidden="true">
    <use xlink:href="#external-24"></use>
</svg>
        </a>
                    </li>
                    <li data-buyelsewhere-item="" data-buyelsewhere-countries="!IN">
                        <a class="inline-flex inline-flex items-center gap-8 f-ui-02 block w-full hover:text-accent flex flex-row flex-nowrap justify-between before:-left-8 before:-right-4 after:-left-10 after:-right-6" href="https://bookshop.org/books?keywords=9780674302457" target="_blank">

    
            <span class="text-inherit z-1 relative inline-flex items-center">Bookshop.org</span>
    
            <svg width="24" height="24" fill="none" class="z-1 relative" viewBox="0 0 24 24" aria-hidden="true">
    <use xlink:href="#external-24"></use>
</svg>
        </a>
                    </li>
                    <li data-buyelsewhere-item="" data-buyelsewhere-countries="GB" inert="" hidden="">
                        <a class="inline-flex inline-flex items-center gap-8 f-ui-02 block w-full hover:text-accent flex flex-row flex-nowrap justify-between before:-left-8 before:-right-4 after:-left-10 after:-right-6" href="https://www.waterstones.com/books/search/term/9780674302457" target="_blank">

    
            <span class="text-inherit z-1 relative inline-flex items-center">Waterstones</span>
    
            <svg width="24" height="24" fill="none" class="z-1 relative" viewBox="0 0 24 24" aria-hidden="true">
    <use xlink:href="#external-24"></use>
</svg>
        </a>
                    </li>

                    <li data-buyelsewhere-item="" data-buyelsewhere-countries="IN" hidden="" inert="">
                        <a class="inline-flex inline-flex items-center gap-8 f-ui-02 block w-full hover:text-accent flex flex-row flex-nowrap justify-between before:-left-8 before:-right-4 after:-left-10 after:-right-6" href="http://www.amazon.in/s?k=9780674302457" target="_blank">

    
            <span class="text-inherit z-1 relative inline-flex items-center">Amazon</span>
    
            <svg width="24" height="24" fill="none" class="z-1 relative" viewBox="0 0 24 24" aria-hidden="true">
    <use xlink:href="#external-24"></use>
</svg>
        </a>
                    </li>
                    <li data-buyelsewhere-item="" data-buyelsewhere-countries="IN" hidden="" inert="">
                        <a class="inline-flex inline-flex items-center gap-8 f-ui-02 block w-full hover:text-accent flex flex-row flex-nowrap justify-between before:-left-8 before:-right-4 after:-left-10 after:-right-6" href="https://www.flipkart.com/search?q=9780674302457" target="_blank">

    
            <span class="text-inherit z-1 relative inline-flex items-center">Flipkart</span>
    
            <svg width="24" height="24" fill="none" class="z-1 relative" viewBox="0 0 24 24" aria-hidden="true">
    <use xlink:href="#external-24"></use>
</svg>
        </a>
                    </li>
        </ul>
    </div>
</div>
    </div>
            </div>
                            <div class="mt-40">
                                            <p class="f-ui-02 text-secondary">ISBN 9780674302457</p>
                                                                <p class="f-ui-02 text-secondary"> Publication date: 09/16/2025</p>
                                    </div>
                                </div>
    </div>
</header>
*/
