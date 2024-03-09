using System;
using System.Collections.Generic;

namespace QuickRectify.Models;

public class DefaultPart
{
    public string Name { get; set; }
    public List<string> Services { get; set; }

    public DefaultPart(string name, List<string> services)
    {
        Name = name;
        Services = services;
    }
}

public class DefaultParts
{
    public static List<DefaultPart> GetDefaultParts()
    {
        List<DefaultPart> defaultParts = new List<DefaultPart>
        {
            new DefaultPart("Biela", new List<string> {"Banho", "Completa", "Só Ferro", "Só Bucha", "Montar Pistão"}),
            new DefaultPart("Bloco", new List<string> {"Banho", "Abrir", "Encamisar", "Plainar", "Soldar", "Mandrilhar", "Trocar Bucha"}),
            new DefaultPart("Cabeçote", new List<string> {"Banho", "Plainar", "Soldar", "Mandrilhar", "Completo", "Regular"}),
            new DefaultPart("Virabrequim", new List<string> {"Banho", "Retificar", "Encher Lateral", "Polir"}),
            new DefaultPart("Volante", new List<string> {"Banho", "Retificar", "Virar Gremalheira"}),
            new DefaultPart("Solda", new List<string> {"Solda Ferro", "Solda Aluminio", "Solda Cart"}),
            new DefaultPart("Outros", new List<string> {"Outros", "Informação"}),
            new DefaultPart("Financeiro", new List<string> {"Dinheiro", "Pix", "Cartão de Débito", "Cartão de Crédito", "Deve", "Não Pagou"}),

        };

        defaultParts.Sort((part1, part2) => part1.Name.CompareTo(part2.Name));
        foreach (var defaultPart in defaultParts) defaultPart.Services.Sort();

        return defaultParts;
    }
}

