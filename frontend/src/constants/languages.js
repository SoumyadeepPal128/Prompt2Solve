
const LANGUAGES = [
{
  id: "cpp",
  label: "C++",
  monacoLang: "cpp",
  boilerplate: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(NULL);
    return 0;
}
`,
},
  {
    id: "python",
    label: "Python",
    monacoLang: "python",
    boilerplate: `def main():
    pass

if __name__ == "__main__":
    main()
`,
  },
  {
    id: "javascript",
    label: "JavaScript",
    monacoLang: "javascript",
    boilerplate: `function main() {
    
}

main();
`,
  },
];

export default LANGUAGES;