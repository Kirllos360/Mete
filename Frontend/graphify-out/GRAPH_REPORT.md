# Graph Report - .  (2026-05-25)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 699 nodes · 1691 edges · 50 communities (37 shown, 13 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6388d029`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 49|Community 49]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 232 edges
2. `SmartTable()` - 48 edges
3. `TicketsPage()` - 32 edges
4. `PaymentsPage()` - 31 edges
5. `Button()` - 30 edges
6. `MeterAssignPage()` - 29 edges
7. `StatusBadge()` - 28 edges
8. `ReadingNewPage()` - 28 edges
9. `ProjectDetailPage()` - 27 edges
10. `SupportPage()` - 27 edges

## Surprising Connections (you probably didn't know these)
- `agent-ctx/4-layout-builder.md` --references--> `src/components/layout/AppShell.tsx`  [EXTRACTED]
  agent-ctx/4-layout-builder.md → src/components/layout/AppShell.tsx
- `InputOTP()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/input-otp.tsx → src/lib/utils.ts
- `SidebarItem()` --calls--> `cn()`  [EXTRACTED]
  src/components/layout/AppSidebar.tsx → src/lib/utils.ts
- `AlertDialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts
- `AlertDialogContent()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts

## Communities (50 total, 13 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.12
Nodes (64): AlertsPage(), BalancesPage(), ConsumptionPage(), highConsumption, missingReadings, zeroConsumption, InvoiceDetailPage(), InvoicesPage() (+56 more)

### Community 1 - "Community 1"
Cohesion: 0.03
Nodes (64): dependencies, class-variance-authority, clsx, cmdk, date-fns, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities (+56 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (38): useIsMobile(), AppShell(), renderPage(), AppSidebar(), AppSidebarProps, hrefToPageKey, iconMap, pageKeyToHref (+30 more)

### Community 3 - "Community 3"
Cohesion: 0.10
Nodes (38): PaymentsPage(), RoleSwitcher(), MeterReplacePage(), defaultStatusColorMap, SmartTable(), SmartTableColumn, SmartTableFilter, SmartTableProps (+30 more)

### Community 4 - "Community 4"
Cohesion: 0.09
Nodes (38): cn(), CardAction(), CardDescription(), CardFooter(), Separator(), Sheet(), SheetContent(), SheetDescription() (+30 more)

### Community 5 - "Community 5"
Cohesion: 0.06
Nodes (35): ActivityItem, Alert, AlertSeverity, AlertType, Balance, Building, ConsumptionRecord, Customer (+27 more)

### Community 6 - "Community 6"
Cohesion: 0.09
Nodes (26): geistMono, geistSans, metadata, Action, ActionType, actionTypes, addToRemoveQueue(), dispatch() (+18 more)

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (17): HoverCard(), HoverCardContent(), NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuViewport(), Progress(), RadioGroup() (+9 more)

### Community 8 - "Community 8"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+12 more)

### Community 9 - "Community 9"
Cohesion: 0.14
Nodes (15): SidebarItemProps, PageHeader(), PageHeaderProps, pageHrefMap, parentMap, pageHrefMap, PagePlaceholder(), PagePlaceholderProps (+7 more)

### Community 10 - "Community 10"
Cohesion: 0.12
Nodes (15): AlertDialog(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogOverlay(), AlertDialogTitle(), buttonVariants (+7 more)

### Community 11 - "Community 11"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 12 - "Community 12"
Cohesion: 0.12
Nodes (11): Menubar(), MenubarCheckboxItem(), MenubarContent(), MenubarItem(), MenubarLabel(), MenubarRadioItem(), MenubarSeparator(), MenubarShortcut() (+3 more)

### Community 13 - "Community 13"
Cohesion: 0.13
Nodes (11): activityColorMap, activityIconMap, DashboardPage(), iconMap, KPICard(), PIE_COLORS, revenueData, severityConfig (+3 more)

### Community 14 - "Community 14"
Cohesion: 0.14
Nodes (13): name, private, scripts, build, db:generate, db:migrate, db:push, db:reset (+5 more)

### Community 15 - "Community 15"
Cohesion: 0.21
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 16 - "Community 16"
Cohesion: 0.20
Nodes (11): createSystemMessage(), createUserMessage(), generateMessageId(), httpServer, io, joinMessage, leaveMessage, Message (+3 more)

### Community 17 - "Community 17"
Cohesion: 0.17
Nodes (11): __dirname, __filename, devDependencies, bun-types, eslint, playwright, tailwindcss, @tailwindcss/postcss (+3 more)

### Community 18 - "Community 18"
Cohesion: 0.22
Nodes (8): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), THEMES, useChart()

### Community 19 - "Community 19"
Cohesion: 0.25
Nodes (9): FormControl(), FormDescription(), FormFieldContext, FormFieldContextValue, FormItem(), FormItemContext, FormLabel(), FormMessage() (+1 more)

### Community 20 - "Community 20"
Cohesion: 0.18
Nodes (9): Command(), CommandDialog(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator(), CommandShortcut() (+1 more)

### Community 21 - "Community 21"
Cohesion: 0.18
Nodes (6): DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerTitle()

### Community 22 - "Community 22"
Cohesion: 0.31
Nodes (7): LoginPage(), AuthState, ROLES, rolePermissions, User, UserRole, Label()

### Community 23 - "Community 23"
Cohesion: 0.20
Nodes (8): ContextMenu(), ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubContent()

### Community 24 - "Community 24"
Cohesion: 0.24
Nodes (9): agent-ctx/4-layout-builder.md, src/components/layout/AppShell.tsx, src/components/layout/AppSidebar.tsx, src/components/layout/TopNav.tsx, src/lib/mock-auth.ts, src/lib/mock-data.ts, src/lib/navigation.ts, src/lib/router-store.ts (+1 more)

### Community 25 - "Community 25"
Cohesion: 0.52
Nodes (6): PORT, run(), sleep(), startAppServer(), stopAppServer(), waitForServer()

### Community 26 - "Community 26"
Cohesion: 0.57
Nodes (5): dev.sh script, log_step_end(), log_step_start(), start_mini_services(), wait_for_service()

### Community 27 - "Community 27"
Cohesion: 0.33
Nodes (5): Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbPage(), BreadcrumbSeparator()

### Community 28 - "Community 28"
Cohesion: 0.40
Nodes (3): AccordionContent(), AccordionItem(), AccordionTrigger()

### Community 29 - "Community 29"
Cohesion: 0.40
Nodes (3): InputOTP(), InputOTPGroup(), InputOTPSlot()

### Community 31 - "Community 31"
Cohesion: 0.50
Nodes (4): Alert(), AlertDescription(), AlertTitle(), alertVariants

## Knowledge Gaps
- **224 isolated node(s):** `target`, `lib`, `allowJs`, `skipLibCheck`, `strict` (+219 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 4` to `Community 0`, `Community 2`, `Community 3`, `Community 6`, `Community 7`, `Community 9`, `Community 10`, `Community 12`, `Community 13`, `Community 15`, `Community 18`, `Community 19`, `Community 20`, `Community 21`, `Community 22`, `Community 23`, `Community 27`, `Community 28`, `Community 29`, `Community 30`, `Community 31`?**
  _High betweenness centrality (0.316) - this node is a cross-community bridge._
- **Why does `DashboardPage()` connect `Community 13` to `Community 0`, `Community 4`, `Community 7`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `SmartTable()` connect `Community 3` to `Community 0`, `Community 2`, `Community 4`, `Community 7`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `target`, `lib`, `allowJs` to the rest of the system?**
  _225 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.11724948574786953 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.03125 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06259426847662142 - nodes in this community are weakly interconnected._