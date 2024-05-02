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
            new DefaultPart("Biela", new List<string> {"Banho", "Completa", "Só Ferro", "Só Bucha", "Montar Pistão", "Venda", "Outros"}),
            new DefaultPart("Bloco", new List<string> {"Banho", "Abrir", "Brunir", "Encamisar", "Plainar", "Soldar", "Mandrilhar", "Trocar Bucha", "Rosca", "Outros"}),
            new DefaultPart("Cabeçote", new List<string> {"Banho", "Plainar", "Soldar", "Mandrilhar", "Completo", "Regular", "Venda", "Outros"}),
            new DefaultPart("Virabrequim", new List<string> {"Banho", "Retificar", "Encher Lateral", "Polir", "Venda", "Outros"}),
            new DefaultPart("Volante", new List<string> {"Banho", "Retificar", "Virar Gremalheira", "Outros"}),
            new DefaultPart("Solda", new List<string> {"Solda Ferro", "Solda Aluminio", "Solda Cart", "Outros"}),
            new DefaultPart("Outros", new List<string> {"Outros", "Informação", "Venda"}),
            new DefaultPart("Financeiro", new List<string> {"Dinheiro", "Pix", "Cartão de Débito", "Cartão de Crédito", "Deve", "Não Pagou"}),

        };

        defaultParts.Sort((part1, part2) => part1.Name.CompareTo(part2.Name));
        foreach (var defaultPart in defaultParts) defaultPart.Services.Sort();

        return defaultParts;
    }
}

