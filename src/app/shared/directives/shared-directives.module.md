# The Directive Module:
this module is used to modify DOM elements within the application of which it can be either structural or attribute direcive examples of this include ngif, ngfor, ngswitch etc.

# EntryPoint:
the entry point to this is the shared directives.modules.ts which stand as an interface between the different modules and the directive modules

    //inistancating the directives in an array
    const directives = [
    DropdownAnchorDirective,
    DropdownLinkDirective,
    AppDropdownDirective,
    ScrollToDirective,
    SidebarDirective,
    SidebarContainerDirective,
    SidebarContentDirective,
    SidebarTogglerDirective,
    HighlightjsDirective,
    FullScreenWindowDirective],

    /**
    * @param  {[CommonModule]} import the common modules
    * @param  {directives} declarations of the directive in the ngmodule
    * @param  {directives}} exports export it for injection it to other component
    */
    @NgModule({
    imports: [
        CommonModule
    ],
    declarations: directives,
    exports: directives
    })

some of these directive includes:
1. confirm-equal-validator
2. dropdown-ancho
3. dropdown-link
4. full-screen
5. highlightjs etc.