"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_1 = require("@angular/router");
var card_service_1 = require('./card.service');
var card_detail_component_1 = require('./card-detail.component');
var CardlistComponent = (function () {
    function CardlistComponent(router, cardService) {
        this.router = router;
        this.cardService = cardService;
        this.addingCard = false;
    }
    CardlistComponent.prototype.getCards = function () {
        var _this = this;
        this.cardService.getCards().then(function (cards) { return _this.cards = cards; });
    };
    CardlistComponent.prototype.ngOnInit = function () {
        this.getCards();
    };
    CardlistComponent.prototype.onSelect = function (card) { this.selectedCard = card; };
    CardlistComponent.prototype.gotoDetail = function () {
        this.router.navigate(['/detail', this.selectedCard.id]);
    };
    CardlistComponent.prototype.addCard = function () {
        this.addingCard = true;
        this.selectedCard = null;
    };
    CardlistComponent.prototype.close = function (savedCard) {
        this.addingCard = false;
        if (savedCard) {
            this.getCards();
        }
    };
    CardlistComponent.prototype.deleteCard = function (card, event) {
        var _this = this;
        event.stopPropagation();
        this.cardService
            .delete(card)
            .then(function (res) {
            _this.cards = _this.cards.filter(function (h) { return h !== card; });
            if (_this.selectedCard === card) {
                _this.selectedCard = null;
            }
        })
            .catch(function (error) { return _this.error = error; });
    };
    CardlistComponent = __decorate([
        core_1.Component({
            selector: 'cards',
            templateUrl: 'app/cardlist.component.html',
            styleUrls: ['app/cardlist.component.css'],
            directives: [card_detail_component_1.CardDetailComponent]
        }), 
        __metadata('design:paramtypes', [router_1.Router, card_service_1.CardService])
    ], CardlistComponent);
    return CardlistComponent;
}());
exports.CardlistComponent = CardlistComponent;
//# sourceMappingURL=cardlist.component.js.map