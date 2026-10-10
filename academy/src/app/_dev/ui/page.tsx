import type { Metadata } from "next";
import Link from "next/link";
import { Award, BookOpen, Flame, Heart, Inbox, Leaf, Search, Sparkles } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Callout,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Container,
  Countdown,
  EmptyState,
  FormField,
  FormRow,
  Input,
  PageHeader,
  Progress,
  ProgressRing,
  ScrollArea,
  Section,
  Separator,
  Skeleton,
  StatCard,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@/components/ui";
import { Logo, LogoMark } from "@/components/shared/logo";
import { Illustration, ILLUSTRATION_NAMES } from "@/components/shared/illustration";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { Markdown } from "@/components/shared/markdown";
import { Eyebrow } from "@/components/shared/eyebrow";
import { DemoRibbon } from "@/components/shared/demo-ribbon";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageSection } from "@/components/layout/page-section";
import { ButtonStates, CurrencyDemo, FormDemos, OverlayDemos, ToastDemos } from "./demos";

export const metadata: Metadata = { title: "UI showcase", robots: { index: false, follow: false } };

const SAMPLE_MD = `## What you’ll learn

Small, **repeatable** steps — never *grand overhauls*. See the [course page](/courses) or the [placeholder link](https://forms.gle/abc).

- Notice the craving
- Name the feeling
  - then breathe
- Choose one baby step

1. Watch
2. Reflect
3. Act

> Your body is forgiving. It’s been waiting for you to show up, not to be perfect.

| Module | Unlocks | XP |
|---|:-:|--:|
| M1 | Day 0 | 120 |
| M2 | Day 7 | 150 |

---

Inline \`code\` and <b>raw html</b> stays as text.`;

function Demo({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="font-serif text-2xl text-rose-strong">{title}</h2>
      <div className="gold-rule mt-2 mb-5" aria-hidden="true" />
      {children}
    </section>
  );
}

const tokens = [
  "bg-cream",
  "bg-cream-2",
  "bg-paper",
  "bg-rose",
  "bg-rose-strong",
  "bg-rose-soft",
  "bg-gold",
  "bg-gold-soft",
  "bg-ink",
  "bg-muted",
  "bg-sage",
  "bg-sage-strong",
  "bg-sage-soft",
  "bg-sky-soft",
  "bg-line",
  "bg-danger",
  "bg-danger-soft",
  "bg-warning",
  "bg-warning-soft",
];

// Computed once per server render of this module (demo only).
const saleEnds = new Date(Date.now() + 3 * 86_400_000 + 5 * 3_600_000).toISOString();

export default function UiShowcasePage() {
  return (
    <>
      <SiteHeader user={null} cartCount={2} />
      <main id="main" className="flex-1">
        <Section spacing="sm">
          <Container>
            <PageHeader
              eyebrow="Design system"
              title="UI showcase"
              description="Every primitive, illustration and shell piece in one place for visual QA. Not linked from the site."
              actions={
                <>
                  <ThemeToggle showLabel />
                  <Button asChild variant="outline" size="sm">
                    <Link href="/_dev/ui/learner">Learner shell</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/_dev/ui/admin">Admin shell</Link>
                  </Button>
                </>
              }
            />
          </Container>
        </Section>

        <Container className="space-y-16 pb-24">
          <Demo title="Colour tokens" id="tokens">
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-7">
              {tokens.map((t) => (
                <div key={t} className="text-xs">
                  <div className={`h-12 rounded-lg border border-border ${t}`} />
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">{t.replace("bg-", "")}</p>
                </div>
              ))}
            </div>
          </Demo>

          <Demo title="Typography" id="type">
            <Eyebrow>Baby steps · your health journey</Eyebrow>
            <h1 className="mt-2">Your body is forgiving.</h1>
            <h2 className="mt-3">It’s been waiting for you to show up</h2>
            <h3 className="mt-3">not to be perfect.</h3>
            <p className="mt-4 max-w-prose text-muted-foreground">
              Body copy in Nunito Sans. Small, repeatable actions grounded in named sources and delivered with grace over guilt.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Eyebrow tone="sage">Sage eyebrow</Eyebrow>
              <Eyebrow tone="gold">Gold eyebrow</Eyebrow>
              <Eyebrow tone="muted">Muted eyebrow</Eyebrow>
            </div>
          </Demo>

          <Demo title="Logo" id="logo">
            <div className="flex flex-wrap items-end gap-8 rounded-lg border border-border bg-card p-6">
              <Logo height={28} />
              <Logo height={40} />
              <Logo height={56} />
              <Logo variant="mark" height={28} />
              <Logo variant="mark" height={40} />
              <span className="text-rose-strong">
                <LogoMark size={40} mono />
              </span>
              <span className="rounded-lg bg-ink p-3 text-cream">
                <Logo height={32} mono />
              </span>
            </div>
          </Demo>

          <Demo title="Buttons" id="buttons">
            <div className="flex flex-wrap items-center gap-3">
              <Button>Default (rose)</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="gold">Gold</Button>
              <Button disabled>Disabled</Button>
              <ButtonStates />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="icon" aria-label="Search">
                <Search />
              </Button>
              <Button asChild variant="outline">
                <Link href="/courses">
                  <BookOpen /> As Link
                </Link>
              </Button>
            </div>
          </Demo>

          <Demo title="Badges" id="badges">
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="success">
                <Leaf /> Complete
              </Badge>
              <Badge variant="gold">
                <Sparkles /> Bestseller
              </Badge>
              <Badge variant="rose">New</Badge>
              <Badge variant="muted">Draft</Badge>
            </div>
          </Demo>

          <Demo title="Form controls" id="forms">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-5">
                <FormRow>
                  <FormField id="first" label="First name" required>
                    <Input placeholder="Cynthia" />
                  </FormField>
                  <FormField id="email" label="Email" hint="We’ll send your magic link here." required>
                    <Input type="email" placeholder="you@example.com" />
                  </FormField>
                </FormRow>
                <FormField id="pw" label="Password" error="Please use at least 8 characters.">
                  <Input type="password" defaultValue="short" />
                </FormField>
                <FormField id="msg" label="Message" hint="Optional, but we read every one." optionalText="">
                  <Textarea placeholder="What brought you here?" />
                </FormField>
                <Input disabled placeholder="Disabled input" />
              </div>
              <FormDemos />
            </div>
          </Demo>

          <Demo title="Cards" id="cards">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Baby Steps</CardTitle>
                  <CardDescription>Your health journey, one step at a time.</CardDescription>
                  <CardAction>
                    <Badge variant="gold">Bestseller</Badge>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <Illustration name="seedling" className="mx-auto h-32 w-32 text-rose-strong" />
                </CardContent>
                <CardFooter className="justify-between">
                  <span className="font-serif text-xl">$197</span>
                  <Button size="sm">Enrol</Button>
                </CardFooter>
              </Card>
              <Card className="card-soft">
                <CardHeader>
                  <CardTitle>With avatar</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarImage src="https://invalid.example/nope.png" alt="" />
                    <AvatarFallback>CM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Cynthia Myers Morrison, EdD</p>
                    <p className="text-sm text-muted-foreground">Instructor</p>
                  </div>
                </CardContent>
              </Card>
              <StatCard label="Current streak" value="4 days" hint="+1 since yesterday" trend="up" icon={<Flame />} tone="rose" />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <StatCard label="XP" value="1,240" hint="Sprout · 1,260 to Bloom" icon={<Sparkles />} tone="gold" />
              <StatCard label="Lessons complete" value="12 / 48" icon={<BookOpen />} tone="sage" />
              <StatCard label="Certificates" value="0" hint="Finish Module 7 to earn one" icon={<Award />} />
            </div>
          </Demo>

          <Demo title="Alerts & callouts" id="alerts">
            <div className="grid gap-3 md:grid-cols-2">
              <Alert>
                <Inbox />
                <AlertTitle>Default</AlertTitle>
                <AlertDescription>A neutral note.</AlertDescription>
              </Alert>
              <Alert variant="info">
                <Inbox />
                <AlertTitle>Info</AlertTitle>
                <AlertDescription>Module 2 unlocks in 3 days.</AlertDescription>
              </Alert>
              <Alert variant="success">
                <Leaf />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>Lesson marked complete. +25 XP.</AlertDescription>
              </Alert>
              <Alert variant="warning">
                <Heart />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>Your card expires next month.</AlertDescription>
              </Alert>
              <Alert variant="destructive" className="md:col-span-2">
                <Heart />
                <AlertTitle>Destructive</AlertTitle>
                <AlertDescription>We couldn’t process the payment. Nothing was charged.</AlertDescription>
              </Alert>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Callout />
              <Callout variant="generic" title="A thought to carry">
                Progress, not perfection. One small step today is enough.
              </Callout>
              <Callout variant="sage" title="Nicely done" icon={<Leaf />}>
                You finished Module 1. Take a moment to notice how that feels.
              </Callout>
              <Callout variant="gold" title="Heads up">
                This lesson has a downloadable workbook.
              </Callout>
            </div>
          </Demo>

          <Demo title="Progress" id="progress">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <Progress value={35} aria-label="Course progress" />
                <Progress value={60} tone="rose" size="sm" aria-label="Rose small" />
                <Progress value={85} tone="gold" size="lg" aria-label="Gold large" />
              </div>
              <div className="flex flex-wrap items-center gap-6">
                <ProgressRing value={15} size="xs" />
                <ProgressRing value={42} size="sm" tone="rose" />
                <ProgressRing value={68} size="md" />
                <ProgressRing value={100} size="lg" tone="gold">
                  <Award className="size-8 text-warning" />
                </ProgressRing>
              </div>
            </div>
          </Demo>

          <Demo title="Tabs & accordion" id="tabs">
            <div className="grid gap-6 md:grid-cols-2">
              <Tabs defaultValue="notes">
                <TabsList>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="transcript">Transcript</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>
                <TabsContent value="notes" className="text-sm text-muted-foreground">
                  Lesson notes appear here.
                </TabsContent>
                <TabsContent value="transcript" className="text-sm text-muted-foreground">
                  Transcript appears here.
                </TabsContent>
                <TabsContent value="resources" className="text-sm text-muted-foreground">
                  Downloads appear here.
                </TabsContent>
              </Tabs>
              <Accordion type="single" collapsible defaultValue="a">
                <AccordionItem value="a">
                  <AccordionTrigger>Do I need any equipment?</AccordionTrigger>
                  <AccordionContent>No. Just a notebook and a little curiosity.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="b">
                  <AccordionTrigger>How long do I have access?</AccordionTrigger>
                  <AccordionContent>Lifetime access, including future updates to this course.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="c">
                  <AccordionTrigger>Can my partner join?</AccordionTrigger>
                  <AccordionContent>Yes — every enrolment includes one partner seat.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </Demo>

          <Demo title="Overlays" id="overlays">
            <OverlayDemos />
          </Demo>

          <Demo title="Toasts" id="toasts">
            <ToastDemos />
          </Demo>

          <Demo title="Table, scroll area, skeleton, separator" id="table">
            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              <Table>
                <TableCaption>Recent orders (demo data)</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Learner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    ["#1042", "Ada L.", "paid", "$197"],
                    ["#1043", "Ben K.", "refunded", "$197"],
                    ["#1044", "Cleo M.", "pending", "$29"],
                  ].map(([id, who, status, total]) => (
                    <TableRow key={id}>
                      <TableCell className="font-medium">{id}</TableCell>
                      <TableCell>{who}</TableCell>
                      <TableCell>
                        <Badge variant={status === "paid" ? "success" : status === "refunded" ? "muted" : "gold"}>{status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="space-y-4">
                <ScrollArea className="h-40 rounded-lg border border-border bg-card p-3 text-sm">
                  {Array.from({ length: 20 }, (_, i) => (
                    <p key={i} className="py-1">
                      Transcript line {i + 1}
                    </p>
                  ))}
                </ScrollArea>
                <Separator />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-24 w-full" />
                </div>
                <Separator tone="gold" />
              </div>
            </div>
          </Demo>

          <Demo title="Empty state & page header" id="empty">
            <div className="grid gap-6 md:grid-cols-2">
              <EmptyState
                icon={<Inbox />}
                title="No notes yet"
                description="Your reflections will live here. Jot one down whenever something lands."
                action={<Button size="sm">Add a note</Button>}
              />
              <EmptyState size="sm" icon={<Illustration name="leaves" />} title="Nothing to review" description="Quiet in here, in a good way." />
              <div className="rounded-lg border border-border bg-card p-6 md:col-span-2">
                <PageHeader
                  eyebrow="My learning"
                  title="Welcome back, Ada"
                  description="You’re 35% through Baby Steps. Module 2 unlocks on Thursday."
                  actions={<Button>Continue lesson</Button>}
                  as="h2"
                />
              </div>
            </div>
          </Demo>

          <Demo title="Countdown & currency" id="countdown">
            <div className="space-y-4">
              <Countdown to={saleEnds} label="Launch price ends in" />
              <Countdown to={saleEnds} compact hideSeconds label="Compact:" />
              <Countdown to="2020-01-01T00:00:00Z" label="Past date:" doneText="Sale ended" />
              <CurrencyDemo />
            </div>
          </Demo>

          <Demo title="Illustrations" id="illustrations">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
              {ILLUSTRATION_NAMES.map((name) => (
                <figure key={name} className="rounded-lg border border-border bg-card p-4 text-center">
                  <Illustration name={name} className="text-ink" />
                  <figcaption className="mt-2 font-mono text-xs text-muted-foreground">{name}</figcaption>
                </figure>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 rounded-lg bg-rose-soft/50 p-4">
              <Illustration name="bloom" size={48} className="text-rose-strong" />
              <Illustration name="bloom" size={48} mono className="text-sage-strong" />
              <Illustration name="cradle" size={64} title="A cradle under the stars" />
            </div>
          </Demo>

          <Demo title="Medical disclaimer & markdown" id="markdown">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <MedicalDisclaimer />
                <MedicalDisclaimer showReviewTag />
                <MedicalDisclaimer variant="inline" showReviewTag />
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <Markdown content={SAMPLE_MD} headingOffset={1} />
              </div>
            </div>
          </Demo>

          <Demo title="Page section helper" id="page-section">
            <div className="rounded-lg border border-dashed border-border">
              <PageSection
                eyebrow="Our promise"
                title="Science-backed. Heart-led. Baby steps."
                description="Three promises, one calm path."
                align="center"
                spacing="sm"
                tone="cream2"
              >
                <div className="grid gap-4 sm:grid-cols-3">
                  {["Science-backed", "Heart-led", "Baby steps"].map((t) => (
                    <Card key={t} className="py-4">
                      <CardContent className="text-center font-serif text-lg">{t}</CardContent>
                    </Card>
                  ))}
                </div>
              </PageSection>
            </div>
          </Demo>

          <Demo title="Header (signed in)" id="header-in">
            <div className="overflow-hidden rounded-lg border border-border">
              <SiteHeader user={{ name: "Ada Lovelace", avatar_url: null, role: "admin" }} cartCount={0} className="static" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">The signed-out header is at the top of this page. Footer is below.</p>
          </Demo>
        </Container>
      </main>
      <SiteFooter />
      <DemoRibbon demo />
    </>
  );
}
