import React from 'react'
import style from '../../css/LoginRegister/ExtendedRules.module.css'
import board from '../../utils/board.png'
import liternik1 from '../../utils/liternik1.jpg'
import liternik2 from '../../utils/liternik2.jpg'
import liternik3 from '../../utils/liternik3.jpg'
import liternik4 from '../../utils/liternik4.jpg'

const ViewRules = () => {
    return (
        <div className={style["main-container"]}>
            <div className={style["grid-container"]}>
                <div className={style["first-grid-container"]}>
                    <h1 className={style["rules-header"]}>Zasady gry - Liternik</h1>
                    <span className={style["span"]}>Liternik został stworzony z myślą o osobach, chcących spędzić miło czas, 
                        dobrze się bawiąc. Jest to interaktywna gra słowna dla dwóch osób, opierająca się na  
                        istniejącej i wszystkim znanej grze scrabble, która umożliwia graczom rywalizować pomiędzy  
                        sobą w układaniu słów na planszy.
                    </span>
                    <span className={style["span"]}>
                        Celem nadrzędnym jest maksymalizowanie swojej wypłaty, czyli uzyskanie jak największej liczby  
                        punktów, wykorzystując wartości punktowe liter <br />i premiowane pola.
                    </span>
                    <h2 className={style["rules-header"]}>Podstawowe reguły - rozpoczęcie gry</h2>
                    <span className={style["span"]}>
                        Gracze mają do dyspozycji 98 płytek z literami oraz dwie puste, które można zastąpić wybraną literą. 
                        Podstawowy rodzaj planszy składa się z 15 kolumn i 15 wierszy rozdzielonych liniami. 
                        Grę rozpoczyna jeden z graczy wybrany losowo. Ruch w grze jest rozumiany poprzez: 
                        <ul>
                            <br />
                            <li>Ułożenie słowa</li>
                            <li>Wymiana liter</li>
                            <li>Opuszczenie kolejki</li>
                            <br />
                        </ul>
                        Wymagane jest, aby pierwsze słowo przechodziło przez wyznaczony kafelek, symbolizujący środek planszy. 
                        Słowa tworzy się poprzez przeciąganie liter. <br />Co ważne, litery znajdujące się na sąsiednich polach, czytane  
                        są od lewej do prawej, oraz od góry do dołu.  
                        Pierwsze słowo powinno składać się z co najmniej dwóch liter. Na późniejszych etapach gry, może to być jedna  
                        lub więcej liter.  
                        Istnieje możliwość wymiany liter, jednak skutkuje to utratą kolejki. Wymienione przez gracza płytki, wracają do puli.  
                        Nadrzędną zasadą jest, aby wybrane litery zostały umieszczone w tym samym rzędzie, lub kolumnie (niedopuszczalne  
                        jest układanie liter po skosie).
                    </span>
                    <h2 className={style["rules-header"]}>Tworzenie słów</h2>
                    <span className={style["span"]}>
                        Istnieją zasady, co do sposobu tworzenia nowych słów na planszy.
                        <ul>
                            <br />
                            <li>Poszerzenie istniejącego już na planszy słowa poprzez dodanie do niego litery na początku lub końcu.</li>
                            <br />
                            <ul>W przykładzie dodano literę <span style={{fontStyle: 'italic'}}>Ć</span> do słowa <span style={{fontStyle: 'italic'}}>ROBI</span> ułożonego w poprzedniej turze.</ul>
                            <br />
                            <div className = {style['img-container']}>
                                <img src={liternik1}></img>
                            </div>
                            <br />
                            <li>Utworzenie słowa w pionie lub poziomie poprzez dodanie liter tworzących słowo do istniejącego już wyrazu.</li>
                            <br />
                            <ul>W przykładzie dołożono pionowo litery do poziomego słowa <span style={{fontStyle: 'italic'}}>ROBIĆ</span> tym samym uzyskując nowe słowo <span style={{fontStyle: 'italic'}}>PROŚ</span>.</ul>
                            <br />
                            <div className = {style['img-container']}>
                                <img src={liternik2}></img>
                            </div>
                            <br />
                            <li>Równoległe dodanie słowa do istniejącego wyrazu.</li>
                            <br />
                            <ul>Do istniejących już słów położono trzy litery: <span style={{fontStyle: 'italic'}}>S, J, A</span> tym samym uzyskując nowe słowa: <span style={{fontStyle: 'italic'}}>SOJA, OJ, BA</span>.</ul>
                            <br />
                            <div className = {style['img-container']}>
                                <img src={liternik3}></img>
                            </div>
                            <br />
                            <li>"Mostek", czyli dodanie liter, pomiędzy dwiema lub więcej literami tworząc w ten sposób nowe słowo.</li>
                            <br />
                            <ul>Na planszę dołożono kolejne dwie litery między dwa słowa: <span style={{fontStyle: 'italic'}}>BAT i ĆMO</span> tym samym uzyskując nowe słowo: <span style={{fontStyle: 'italic'}}>TŁOK</span>.</ul>
                            <br />
                            <div className = {style['img-container']}>
                                <img src={liternik4}></img>
                            </div>
                            <br />
                        </ul>
                        Płytkę pustą (masełko), można wykorzystać do utworzenia nowego słowa, ponieważ umożliwia ona graczowi wybór dowolnej litery.  
                    </span>
                    <h2 className={style["rules-header"]}>Weryfikacja</h2>
                    <span className={style["span"]}>
                        Utworzone przez gracza słowa, zostają poddane weryfikacji: jeśli nie znajduje się ono w bazie słów dopuszczalnych w grach,  
                        to traci on kolejkę i nie zostają mu przyznane żadne punkty.  
                        Słowa uznawane za poprawne to te, które występują w słowniku ortograficznym i wszystkie ich odmiany, <br />z wyjątkiem nazw własnych  
                        i słów z łącznikiem, lub apostrofem.
                    </span>
                    <h2 className={style["rules-header"]}>Punktacja</h2>
                    <span className={style["span"]}>
                        <div className={style["table-container"]}>
                        <table className={style["styled-table"]}>
                            <thead className={style["thead-style"]}>
                                <tr className={style["tr-style"]}>
                                    <th className={style["thead-style"]}>Liczba punktów</th>
                                    <th className={style["thead-style"]}>Liczba liter</th>
                                </tr>
                            </thead>
                            <tbody className={style["tbody-style"]}>
                                <tr className={style["tr-row"]}>
                                    <td>Wymiennie</td>
                                    <td>Masełko (x2)</td>
                                </tr>
                                <tr className={style["tr-row"]}>
                                    <td>1</td>
                                    <td>A (x9), E (x7), I (x8), N (x5), O (x6), R (x4), S (x4), W (x4), Z (x5)</td>
                                </tr>
                                <tr className={style["tr-row"]}>
                                    <td>2</td>
                                    <td>C (x3), D (x3), K (x3), L (x3), M (x3), P (x3), T (x3), Y (x4)</td>
                                </tr>
                                <tr className={style["tr-row"]}>
                                    <td>3</td>
                                    <td>B (x2), G (x2), H (x2), J (x2), Ł (x2), U (x2)</td>
                                </tr>
                                <tr className={style["tr-row"]}>
                                    <td>5</td>
                                    <td>Ą (x1), Ę (x1), F (x1), Ó (x1), Ś (x1), Ż (x1)</td>
                                </tr>
                                <tr className={style["tr-row"]}>
                                    <td>6</td>
                                    <td>Ć (x1)</td>
                                </tr>
                                <tr className={style["tr-row"]}>
                                    <td>7</td>
                                    <td>Ń (x1)</td>
                                </tr>
                                <tr className={style["tr-row"]}>
                                    <td>9</td>
                                    <td>Ź (x1)</td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                        Gracz zostaje nagrodzony za ułożone słowo. Wartość wypłaty jest sumą wartości liter tworzących słowo  
                        wraz z uwzględnieniem premii literowych <br />i słownych. Pola literowe podwajają, lub potrajają wartości położonych na nich liter.  
                        Jeśli chociaż jedna litera zostaje umieszczona na polu słownym, to cała wartość wyrazu zostaje odpowiednio podwojona, bądź potrojona.  
                        Masełko położone na którymkolwiek polu premiowym, zostaje wliczone <br />w punktację, bo ma wartość zależną od wybranej litery.    
                        <br /> 
                        PS: Liczba punktów przydzielana za Masełko jest uzależniona od litery, którą użytkownik wybierze.
                    </span>
                    <h2 className={style["rules-header"]}>Zakończenie gry</h2>
                    <span className={style["span"]}>
                        Koniec gry następuje gdy wszystkie litery zostaną wykorzystane, jednocześnie jeden z graczy musi pozbyć się wszystkich liter  
                        Opuszczenie przez wszystkich graczy dwóch kolejek z rzędu, kończy grę niezależnie od tego, jak wiele liter pozostało.  
                        Wynik końcowy każdego z graczy może zostać dodatkowo zmodyfikowany. Jeśli jeden z graczy wykorzystał wszystkie litery, a drugiemu pozostało  
                        ich kilka, to pierwszemu zostaje przydzielona dodatkowo równowartość punktów liter pozostałych drugiemu graczowi, któremu  
                        zostaje odjęta taka sama liczba punktów.
                    </span>
                </div>
                <div className={style["second-grid-container"]}>
                    <h1 className={style["board-header"]}>Plansza Liternik</h1>
                    <img src={board}></img>
                    <div className={style["greetings-container"]}>
                        <h2 className={style["rules-header"]}>Życzymy udanej zabawy!</h2>
                        <br />
                        <h4 className={style["greetings-header"]}>Autorzy: </h4>
                        <br />
                        <h5 className={style["authors-header"]}>Hubert Lewowicki</h5>
                        <h5 className={style["authors-header"]}>Agata Orzechowska</h5>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewRules;