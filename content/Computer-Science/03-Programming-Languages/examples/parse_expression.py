"""A tiny lexer, recursive-descent parser, and tree evaluator."""

import json


SOURCE = "1 + 2 * 3"


def tokenize(source):
    # Convert source characters into tokens while preserving each lexeme.
    tokens = []
    position = 0

    while position < len(source):
        character = source[position]

        if character.isspace():
            position += 1
            continue

        if character.isdigit():
            start = position
            while position < len(source) and source[position].isdigit():
                position += 1
            tokens.append({"type": "NUMBER", "lexeme": source[start:position]})
            continue

        token_types = {"+": "PLUS", "*": "STAR", "(": "LEFT_PAREN", ")": "RIGHT_PAREN"}
        if character in token_types:
            tokens.append({"type": token_types[character], "lexeme": character})
            position += 1
            continue

        raise ValueError(f"Unexpected character at position {position}: {character!r}")

    tokens.append({"type": "EOF", "lexeme": ""})
    return tokens


class Parser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.current = 0

    def parse(self):
        expression = self.parse_addition()
        self.consume("EOF")
        return expression

    def parse_addition(self):
        # Parse multiplication first so it binds more tightly than addition.
        node = self.parse_multiplication()
        while self.match("PLUS"):
            operator = self.previous()["lexeme"]
            right = self.parse_multiplication()
            node = {
                "type": "BinaryExpression",
                "operator": operator,
                "left": node,
                "right": right,
            }
        return node

    def parse_multiplication(self):
        # Parse primary expressions before combining them with multiplication.
        node = self.parse_primary()
        while self.match("STAR"):
            operator = self.previous()["lexeme"]
            right = self.parse_primary()
            node = {
                "type": "BinaryExpression",
                "operator": operator,
                "left": node,
                "right": right,
            }
        return node

    def parse_primary(self):
        if self.match("NUMBER"):
            return {"type": "Number", "value": int(self.previous()["lexeme"])}

        if self.match("LEFT_PAREN"):
            expression = self.parse_addition()
            self.consume("RIGHT_PAREN")
            return expression

        token = self.peek()
        raise ValueError(f"Expected a number or '(', got {token['type']}")

    def match(self, token_type):
        if self.peek()["type"] != token_type:
            return False
        self.current += 1
        return True

    def consume(self, token_type):
        if not self.match(token_type):
            raise ValueError(f"Expected {token_type}, got {self.peek()['type']}")
        return self.previous()

    def peek(self):
        return self.tokens[self.current]

    def previous(self):
        return self.tokens[self.current - 1]


def evaluate(node):
    # Interpret the AST recursively; the AST data itself does not execute.
    if node["type"] == "Number":
        return node["value"]

    left = evaluate(node["left"])
    right = evaluate(node["right"])
    if node["operator"] == "+":
        return left + right
    if node["operator"] == "*":
        return left * right
    raise ValueError(f"Unsupported operator: {node['operator']}")


def main():
    tokens = tokenize(SOURCE)
    tree = Parser(tokens).parse()
    expected_tree = {
        "type": "BinaryExpression",
        "operator": "+",
        "left": {"type": "Number", "value": 1},
        "right": {
            "type": "BinaryExpression",
            "operator": "*",
            "left": {"type": "Number", "value": 2},
            "right": {"type": "Number", "value": 3},
        },
    }
    assert tree == expected_tree, "The AST must place multiplication under addition."

    token_summary = ", ".join(
        f"{token['type']}({token['lexeme']})" if token["lexeme"] else "EOF"
        for token in tokens
    )
    print(f"Source: {SOURCE}")
    print(f"Tokens: {token_summary}")
    print("AST:")
    print(json.dumps(tree, indent=2))
    print(f"Result: {evaluate(tree)}")


if __name__ == "__main__":
    main()
