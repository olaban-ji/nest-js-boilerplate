'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">nest-js-boilerplate-docs</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-cc845d18e4bdf30cf7de2bbf9663278a70b22291e5f88d60faf1b13c635337b4daeaca32c6fd5adf69d6e8f950185a293d7e32aa8e26a0b30a7a399eb1af574f"' : 'data-bs-target="#xs-controllers-links-module-AppModule-cc845d18e4bdf30cf7de2bbf9663278a70b22291e5f88d60faf1b13c635337b4daeaca32c6fd5adf69d6e8f950185a293d7e32aa8e26a0b30a7a399eb1af574f"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-cc845d18e4bdf30cf7de2bbf9663278a70b22291e5f88d60faf1b13c635337b4daeaca32c6fd5adf69d6e8f950185a293d7e32aa8e26a0b30a7a399eb1af574f"' :
                                            'id="xs-controllers-links-module-AppModule-cc845d18e4bdf30cf7de2bbf9663278a70b22291e5f88d60faf1b13c635337b4daeaca32c6fd5adf69d6e8f950185a293d7e32aa8e26a0b30a7a399eb1af574f"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-cc845d18e4bdf30cf7de2bbf9663278a70b22291e5f88d60faf1b13c635337b4daeaca32c6fd5adf69d6e8f950185a293d7e32aa8e26a0b30a7a399eb1af574f"' : 'data-bs-target="#xs-injectables-links-module-AppModule-cc845d18e4bdf30cf7de2bbf9663278a70b22291e5f88d60faf1b13c635337b4daeaca32c6fd5adf69d6e8f950185a293d7e32aa8e26a0b30a7a399eb1af574f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-cc845d18e4bdf30cf7de2bbf9663278a70b22291e5f88d60faf1b13c635337b4daeaca32c6fd5adf69d6e8f950185a293d7e32aa8e26a0b30a7a399eb1af574f"' :
                                        'id="xs-injectables-links-module-AppModule-cc845d18e4bdf30cf7de2bbf9663278a70b22291e5f88d60faf1b13c635337b4daeaca32c6fd5adf69d6e8f950185a293d7e32aa8e26a0b30a7a399eb1af574f"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CreateUserCommand.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateUserCommand</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SchemaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SchemaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRedisModule.html" data-type="entity-link" >AppRedisModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppRedisModule-d7b5d7788cf68bbafe60cd0472435b85d1c458d154780274c5bd0dff10dc377cdb996a3221329476e2725d62577e8f26bd0eec6f5cb8d38e4ffa4fb52da601d1"' : 'data-bs-target="#xs-injectables-links-module-AppRedisModule-d7b5d7788cf68bbafe60cd0472435b85d1c458d154780274c5bd0dff10dc377cdb996a3221329476e2725d62577e8f26bd0eec6f5cb8d38e4ffa4fb52da601d1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppRedisModule-d7b5d7788cf68bbafe60cd0472435b85d1c458d154780274c5bd0dff10dc377cdb996a3221329476e2725d62577e8f26bd0eec6f5cb8d38e4ffa4fb52da601d1"' :
                                        'id="xs-injectables-links-module-AppRedisModule-d7b5d7788cf68bbafe60cd0472435b85d1c458d154780274c5bd0dff10dc377cdb996a3221329476e2725d62577e8f26bd0eec6f5cb8d38e4ffa4fb52da601d1"' }>
                                        <li class="link">
                                            <a href="injectables/AppRedisService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppRedisService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-8ba70b3c257a57b6e46d79f0e4fcb56f8efb9a1330500fc4daa93d7310678ad2de01baee97b5d5aac33878dd630d78e9cc973ca51372adde3008213d9bf09654"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-8ba70b3c257a57b6e46d79f0e4fcb56f8efb9a1330500fc4daa93d7310678ad2de01baee97b5d5aac33878dd630d78e9cc973ca51372adde3008213d9bf09654"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-8ba70b3c257a57b6e46d79f0e4fcb56f8efb9a1330500fc4daa93d7310678ad2de01baee97b5d5aac33878dd630d78e9cc973ca51372adde3008213d9bf09654"' :
                                            'id="xs-controllers-links-module-AuthModule-8ba70b3c257a57b6e46d79f0e4fcb56f8efb9a1330500fc4daa93d7310678ad2de01baee97b5d5aac33878dd630d78e9cc973ca51372adde3008213d9bf09654"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-8ba70b3c257a57b6e46d79f0e4fcb56f8efb9a1330500fc4daa93d7310678ad2de01baee97b5d5aac33878dd630d78e9cc973ca51372adde3008213d9bf09654"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-8ba70b3c257a57b6e46d79f0e4fcb56f8efb9a1330500fc4daa93d7310678ad2de01baee97b5d5aac33878dd630d78e9cc973ca51372adde3008213d9bf09654"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-8ba70b3c257a57b6e46d79f0e4fcb56f8efb9a1330500fc4daa93d7310678ad2de01baee97b5d5aac33878dd630d78e9cc973ca51372adde3008213d9bf09654"' :
                                        'id="xs-injectables-links-module-AuthModule-8ba70b3c257a57b6e46d79f0e4fcb56f8efb9a1330500fc4daa93d7310678ad2de01baee97b5d5aac33878dd630d78e9cc973ca51372adde3008213d9bf09654"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LocalStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/EmailModule.html" data-type="entity-link" >EmailModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/HttpClientModule.html" data-type="entity-link" >HttpClientModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-HttpClientModule-07e7a3199fe87fcb856456947367c1002802ce9de41a738d7a0251a177bf4752a65c94b55a491d11ac7dcc0a4b3be720edc8d3558e87b9fff2a5883e481674c1"' : 'data-bs-target="#xs-injectables-links-module-HttpClientModule-07e7a3199fe87fcb856456947367c1002802ce9de41a738d7a0251a177bf4752a65c94b55a491d11ac7dcc0a4b3be720edc8d3558e87b9fff2a5883e481674c1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-HttpClientModule-07e7a3199fe87fcb856456947367c1002802ce9de41a738d7a0251a177bf4752a65c94b55a491d11ac7dcc0a4b3be720edc8d3558e87b9fff2a5883e481674c1"' :
                                        'id="xs-injectables-links-module-HttpClientModule-07e7a3199fe87fcb856456947367c1002802ce9de41a738d7a0251a177bf4752a65c94b55a491d11ac7dcc0a4b3be720edc8d3558e87b9fff2a5883e481674c1"' }>
                                        <li class="link">
                                            <a href="injectables/HttpClientService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HttpClientService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PaymentModule.html" data-type="entity-link" >PaymentModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StorageModule.html" data-type="entity-link" >StorageModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UsersModule-e51d218912fc1d2ba77219f656f1cf1710058bc1f4a6bee8fdc069961927a2eaf18609e68a61e8ce128009fe8e5dcbf19ebbd2a27227b6fe324c0187852b4afb"' : 'data-bs-target="#xs-controllers-links-module-UsersModule-e51d218912fc1d2ba77219f656f1cf1710058bc1f4a6bee8fdc069961927a2eaf18609e68a61e8ce128009fe8e5dcbf19ebbd2a27227b6fe324c0187852b4afb"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-e51d218912fc1d2ba77219f656f1cf1710058bc1f4a6bee8fdc069961927a2eaf18609e68a61e8ce128009fe8e5dcbf19ebbd2a27227b6fe324c0187852b4afb"' :
                                            'id="xs-controllers-links-module-UsersModule-e51d218912fc1d2ba77219f656f1cf1710058bc1f4a6bee8fdc069961927a2eaf18609e68a61e8ce128009fe8e5dcbf19ebbd2a27227b6fe324c0187852b4afb"' }>
                                            <li class="link">
                                                <a href="controllers/UsersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UsersModule-e51d218912fc1d2ba77219f656f1cf1710058bc1f4a6bee8fdc069961927a2eaf18609e68a61e8ce128009fe8e5dcbf19ebbd2a27227b6fe324c0187852b4afb"' : 'data-bs-target="#xs-injectables-links-module-UsersModule-e51d218912fc1d2ba77219f656f1cf1710058bc1f4a6bee8fdc069961927a2eaf18609e68a61e8ce128009fe8e5dcbf19ebbd2a27227b6fe324c0187852b4afb"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-e51d218912fc1d2ba77219f656f1cf1710058bc1f4a6bee8fdc069961927a2eaf18609e68a61e8ce128009fe8e5dcbf19ebbd2a27227b6fe324c0187852b4afb"' :
                                        'id="xs-injectables-links-module-UsersModule-e51d218912fc1d2ba77219f656f1cf1710058bc1f4a6bee8fdc069961927a2eaf18609e68a61e8ce128009fe8e5dcbf19ebbd2a27227b6fe324c0187852b4afb"' }>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsersSubscriber.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersSubscriber</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/User.html" data-type="entity-link" >User</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AuthResponseDto.html" data-type="entity-link" >AuthResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseEntity.html" data-type="entity-link" >BaseEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/CatchEverythingFilter.html" data-type="entity-link" >CatchEverythingFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChangePasswordDto.html" data-type="entity-link" >ChangePasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserResponseDto.html" data-type="entity-link" >CreateUserResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/EmailService.html" data-type="entity-link" >EmailService</a>
                            </li>
                            <li class="link">
                                <a href="classes/ForgotPasswordDto.html" data-type="entity-link" >ForgotPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetProfileResponseDto.html" data-type="entity-link" >GetProfileResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDto.html" data-type="entity-link" >LoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PasswordResetEmailConsumer.html" data-type="entity-link" >PasswordResetEmailConsumer</a>
                            </li>
                            <li class="link">
                                <a href="classes/RefreshTokenDto.html" data-type="entity-link" >RefreshTokenDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResetPasswordDto.html" data-type="entity-link" >ResetPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProfileDto.html" data-type="entity-link" >UpdateProfileDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/CloudinaryService.html" data-type="entity-link" >CloudinaryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link" >JwtAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalAuthGuard.html" data-type="entity-link" >LocalAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MorganMiddleware.html" data-type="entity-link" >MorganMiddleware</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RequestBodyAndResponseInterceptor.html" data-type="entity-link" >RequestBodyAndResponseInterceptor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RequestContextMiddleware.html" data-type="entity-link" >RequestContextMiddleware</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/S3Service.html" data-type="entity-link" >S3Service</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StripeService.html" data-type="entity-link" >StripeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SuccessResponseInterceptor.html" data-type="entity-link" >SuccessResponseInterceptor</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/RoleGuard.html" data-type="entity-link" >RoleGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ApiResponse.html" data-type="entity-link" >ApiResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ErrorResponse.html" data-type="entity-link" >ErrorResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPaymentService.html" data-type="entity-link" >IPaymentService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IStrorageService.html" data-type="entity-link" >IStrorageService</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});