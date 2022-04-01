
createConst(deaths,0)

createCommand("incDeaths", "you have died {{deaths+=1}}")

deaths++
deaths = 0
const[deaths] = const[deaths] + 1

you have died {{deaths}}
you have died 1



createCommand("addDeaths", "you have died {{deaths+=[[0]]}}")

jam.addDeaths(5)


[[0]] => 5

you have died {{deaths+=5}}

const[deaths] = const[deaths]+5

you have died {{deaths}}

you have died 5

`
createCommand("echo", "echoing: [[0]]")

jam.echo("hello");

[[0]]=>"hello"

echoing: hello

jam.echo(deaths);

deaths => const[deaths] => 5

[[0]] => 5
echoing: 5


(deaths+=) = a

"{{deaths+=1}}" => {{a}}

echo(deaths++)

"echoing: [[0]]" => "echoing: {{deaths++}}" => 


